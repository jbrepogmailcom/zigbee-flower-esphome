# ESPHome Zigbee Laser Flower Monitor (XIAO nRF52840 + VL53L0X)

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
Main firmware config (master):
- `zigbee_flower-lp.yaml`

Compatibility copy:
- `zigbee_flower.yaml`

Compile example:
```bash
esphome compile zigbee_flower-lp.yaml
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
With direct C-code power tweaks (radio + USB/UART handling), the measured current draw is about **~1.33 mA** on this XIAO nRF52840 board. In practice this seems to be the lowest stable level reached so far on this hardware with current ESPHome Zigbee support.

For an ultra-low-power reference (about 6 months per charge), see the MQTT/Wi-Fi (ESP32-C6) version, which still has lower drain:
https://github.com/jbrepogmailcom/flower-fading-monitor

## Home Assistant hint
`distance` can be used for automation, e.g. trigger alert when flower leaves are dropping too fast.
