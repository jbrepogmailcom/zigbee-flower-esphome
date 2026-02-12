#pragma once

#include "esphome/components/logger/logger.h"
#include <zephyr/kernel.h>
#include <zephyr/usb/usb_device.h>

extern "C" {
#include <osif/zb_transceiver.h>
#include <zb_osif.h>
}

inline void esphome_flush_logger_best_effort() {
  if (esphome::logger::global_logger != nullptr) {
    esphome::logger::global_logger->loop();
    esphome::logger::global_logger->loop();
  }
  k_msleep(100);
}

inline void esphome_radio_on_for_measurement() {
  zb_trans_enter_receive();
  k_msleep(50);
}

inline void esphome_radio_off_force() {
  esphome_flush_logger_best_effort();
  zb_trans_enter_sleep();
}

inline void esphome_uart_off_force() {
  esphome_flush_logger_best_effort();
  // 1) Disable USB CDC stack
  usb_disable();
  // 2) Put Zigbee OSIF UART path to sleep
  zb_osif_uart_sleep();
}
