package com.shamla.smarthome.repository;

import com.shamla.smarthome.model.DeviceReading;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceReadingRepository
        extends JpaRepository<DeviceReading, Long> {
}
