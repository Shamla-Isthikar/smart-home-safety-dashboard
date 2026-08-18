package com.shamla.smarthome.service;

import com.shamla.smarthome.model.DeviceReading;
import com.shamla.smarthome.repository.DeviceReadingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeviceReadingService {

    private final DeviceReadingRepository repository;
    private final SafetyRuleEngine safetyRuleEngine;

    public DeviceReadingService(
            DeviceReadingRepository repository,
            SafetyRuleEngine safetyRuleEngine) {
        this.repository = repository;
        this.safetyRuleEngine = safetyRuleEngine;
    }

    public DeviceReading saveReading(DeviceReading reading) {
        reading.setTimestamp(LocalDateTime.now());
        return repository.save(reading);
    }

    public List<DeviceReading> getAllReadings() {
        return repository.findAll();
    }

    public SafetyRuleEngine.SafetyResult evaluateSafety(
            DeviceReading reading) {
        return safetyRuleEngine.evaluate(reading);
    }
}
