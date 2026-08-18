package com.shamla.smarthome.service;

import com.shamla.smarthome.model.DeviceReading;
import org.springframework.stereotype.Service;

@Service
public class SafetyRuleEngine {

    public SafetyResult evaluate(DeviceReading reading) {

        if ("ERROR".equalsIgnoreCase(reading.getStatus())) {
            return new SafetyResult("DEVICE_ERROR", "HIGH");
        }

        if (reading.getTemperature() != null
                && reading.getTemperature() > 35) {
            return new SafetyResult("HIGH_TEMPERATURE", "HIGH");
        }

        if (reading.getPowerWatts() != null
                && reading.getPowerWatts() > 2000) {
            return new SafetyResult("HIGH_POWER", "MEDIUM");
        }

        return new SafetyResult("SAFE", "LOW");
    }

    public record SafetyResult(String alert, String severity) {
    }
}

