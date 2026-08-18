package com.shamla.smarthome.controller;

import com.shamla.smarthome.model.DeviceReading;
import com.shamla.smarthome.service.DeviceReadingService;
import com.shamla.smarthome.service.SafetyRuleEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "*")
public class DeviceReadingController {

    private final DeviceReadingService service;

    public DeviceReadingController(DeviceReadingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DeviceReading> createReading(
            @RequestBody DeviceReading reading) {

        return ResponseEntity.ok(service.saveReading(reading));
    }

    @GetMapping
    public ResponseEntity<List<DeviceReading>> getReadings() {

        return ResponseEntity.ok(service.getAllReadings());
    }

    @GetMapping("/{id}/safety")
    public ResponseEntity<SafetyRuleEngine.SafetyResult> checkSafety(
            @PathVariable Long id) {

        List<DeviceReading> readings = service.getAllReadings();

        return readings.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .map(reading -> ResponseEntity.ok(
                        service.evaluateSafety(reading)))
                .orElse(ResponseEntity.notFound().build());
    }
}
