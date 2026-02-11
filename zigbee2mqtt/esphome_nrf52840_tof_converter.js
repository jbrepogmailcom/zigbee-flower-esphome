const fz = require("zigbee-herdsman-converters/converters/fromZigbee");
const reporting = require("zigbee-herdsman-converters/lib/reporting");
const exposes = require("zigbee-herdsman-converters/lib/exposes");

const e = exposes.presets;
const ea = exposes.access;

const fzLocal = {
  esphome_analog_input: {
    cluster: "genAnalogInput",
    type: ["attributeReport", "readResponse"],
    convert: (model, msg) => {
      if (msg.data.presentValue === undefined) return;
      const ep = msg.endpoint.ID;
      const value = Number(msg.data.presentValue);

      if (ep === 1) return {distance: value};
      if (ep === 2) return {battery_voltage: value};
      if (ep === 3) return {battery: value};
      if (ep === 4) return {battery_aux: value};

      return {[`analog_${ep}`]: value};
    },
  },
};

async function configureAnalogEndpoint(device, coordinatorEndpoint, epId, maxInt, change) {
  const ep = device.getEndpoint(epId);
  if (!ep) return;

  await reporting.bind(ep, coordinatorEndpoint, ["genAnalogInput"]);
  await ep.configureReporting("genAnalogInput", [{
    attribute: "presentValue",
    minimumReportInterval: 0,
    maximumReportInterval: maxInt,
    reportableChange: change,
  }]);
  await ep.read("genAnalogInput", ["presentValue"]);
}

module.exports = {
  zigbeeModel: ["nrf52840-zigbee-tof"],
  model: "nrf52840-zigbee-tof",
  vendor: "esphome",
  description: "ESPHome nRF52840 Zigbee ToF",
  fromZigbee: [fz.ignore_basic_report, fzLocal.esphome_analog_input],
  toZigbee: [],
  exposes: [
    e.numeric("distance", ea.STATE).withUnit("mm").withDescription("Distance"),
    e.numeric("battery_voltage", ea.STATE).withUnit("V").withDescription("Battery voltage"),
    e.numeric("battery", ea.STATE).withUnit("%").withDescription("Battery percentage"),
    e.numeric("battery_aux", ea.STATE).withDescription("Aux analog endpoint 4"),
  ],
  configure: async (device, coordinatorEndpoint) => {
    await configureAnalogEndpoint(device, coordinatorEndpoint, 1, 240, 0.1);
    await configureAnalogEndpoint(device, coordinatorEndpoint, 2, 3600, 0.001);
    await configureAnalogEndpoint(device, coordinatorEndpoint, 3, 3600, 1);
    await configureAnalogEndpoint(device, coordinatorEndpoint, 4, 3600, 0.001);
  },
};
