# hs110 influx exporter

> A TP-link hs110 smart plug exporter for influxDB


# Install
```bash
git clone https://github.com/cgarnier/hs110-influx.git
npm i
```
# Usage

```bash
TIMER=1000 \
DEVICE_IP_ADDR=10.0.0.35 \
DEBUG=true \
INFLUX_HOST=influx.exemple.com \
HOSTNAME=rig_github \
npm start
```

# Docker usage

```bash
# Run the exporter
docker run \
  -e TIMER=1000 \
  -e DEVICE_IP_ADDR=10.0.0.35 \
  -e DEBUG=true \
  -e INFLUX_HOST=influx.exemple.com \
  -e HOSTNAME=rig_github \
  -d cgarnier/hs110-influx

```

# Metrics

This exporter export one metric: power_consumption with current, power, total and voltage.