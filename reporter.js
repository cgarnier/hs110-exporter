const Influx = require('influx');
const os = require('os');

const hostname = process.env.HOSTNAME || os.hostname();
const db = process.env.INFLUX_DB || 'miners_db';

const { Client } = require('tplink-smarthome-api');

const client = new Client();

const influx = new Influx.InfluxDB({
    host: process.env.INFLUX_HOST || 'localhost',
    database: db,
    schema: [
        {
            measurement: 'power_consumption',
            fields: {
                current: Influx.FieldType.FLOAT,
                voltage: Influx.FieldType.FLOAT,
                total: Influx.FieldType.FLOAT,
                power: Influx.FieldType.FLOAT,
            },
            tags: [
                'host'
            ]
        }
    ]
});

class Reporter {
    export(res) {
        influx.writePoints([
            {
                measurement: 'power_consumption',
                tags: {host: hostname},
                fields: res,
            }
        ])
    }
    getDevice () {
        return client.getDevice({host: process.env.DEVICE_IP_ADDR})
            .then(device => {
                this.device = device;
                return device;
            })
    }
    constructor() {
        this.timer = process.env.TIMER || 5000;
        this.device = null;
    }

    query() {
        return this.device.emeter.getRealtime()
    }

    format(raw) {
        delete raw.err_code;
        return raw
    }

    log(res) {
        if (!process.env.DEBUG) return res;
        console.log(res);
        return res
    }

    checkDatabase() {
        return influx.getDatabaseNames()
            .then(names => {
                if (!names.includes(db)) {
                    return influx.createDatabase(db);
                }
            })
            .catch(err => {
                console.error(`Error creating Influx database!`);
            })
    }

    run() {
        this.checkDatabase()
            .then(_ => this.getDevice())
            .then(_ => {
                setInterval(_ => {
                    this.query()
                        .then(res => this.format(res))
                        .then(res => this.log(res))
                        .then(res => this.export(res))
                }, this.timer)
            });
    }
}

module.exports = Reporter;