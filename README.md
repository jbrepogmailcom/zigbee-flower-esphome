# ESPHome Zigbee Flower Monitor (XIAO nRF52840 + VL53L0X)

This project publishes:
- distance (mm)
- battery voltage (V)
- battery (%)

Measurement interval is configured to **4 hours**.

## Hardware
- Seeed Studio XIAO nRF52840 Sense (`xiao_ble` in ESPHome)
- VL53L0X ToF sensor

I2C pins used here:
- `SDA: P1.13`
- `SCL: P1.14`

## ESPHome file
Main firmware config:
- `zigbee_flower.yaml`

Compile example:
```bash
esphome compile zigbee_flower.yaml
```

## Zigbee2MQTT converter
Converter file:
- `zigbee2mqtt/esphome_nrf52840_tof_converter.js`

### Install in Zigbee2MQTT
1. Copy converter to Zigbee2MQTT data directory, e.g.:
```bash
cp zigbee2mqtt/esphome_nrf52840_tof_converter.js /opt/zigbee2mqtt/data/external_converters/
```

2. Add to `/opt/zigbee2mqtt/data/configuration.yaml`:
```yaml
external_converters:
  - external_converters/esphome_nrf52840_tof_converter.js
```

3. Restart Zigbee2MQTT.

4. Reconfigure the device once (MQTT):
```bash
mosquitto_pub -h <MQTT_HOST> -u <MQTT_USER> -P <MQTT_PASS> \
  -t zigbee2mqtt/bridge/request/device/configure \
  -m '{"id":"<YOUR_FRIENDLY_NAME>"}'
```

## Known limitation (power)
With current ESPHome Zigbee implementation, this setup was measured around **~10 mA** average, not ultra-low-power SED levels. There is still room for improvement when sleepy end-device behavior is improved upstream.

## Home Assistant hint
`distance` can be used for automation, e.g. trigger alert when flower leaves are dropping too fast.
