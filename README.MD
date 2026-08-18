# Smart Home Safety Dashboard

A small full-stack application for recording smart-home device readings and checking them against simple safety rules.

## Features

- Add device readings for:
  - Device ID
  - Temperature
  - Power consumption
  - Device status
- Store readings in PostgreSQL
- View saved readings
- Check the safety status of a reading
- Display readings and safety alerts in a React dashboard
- Run the frontend, backend, and database with Docker Compose

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Java 17, Spring Boot, Spring Web, Spring Data JPA
- **Database:** PostgreSQL 16
- **Web Server:** Nginx
- **Containerization:** Docker, Docker Compose
- **Build Tool:** Maven
- **Version Control:** Git, GitHub

## Architecture

```text
React
  |
  | REST API
  v
Spring Boot
  |
  +---- Safety Rule Engine
  |
  v
PostgreSQL
```

The backend is organized into controller, service, repository, and model layers.

## Safety Rules

The application uses a simple `SafetyRuleEngine` to check device readings.

For example:

```text
Temperature > 35°C
       |
       v
HIGH_TEMPERATURE
       |
       v
HIGH
```

More rules can be added later.

## REST API

### Create a Reading

```http
POST /api/readings
```

Example request:

```json
{
  "deviceId": "AC-01",
  "temperature": 38,
  "powerWatts": 1800,
  "status": "ON"
}
```

### Get All Readings

```http
GET /api/readings
```

### Check Safety

```http
GET /api/readings/{id}/safety
```

Example response:

```json
{
  "alert": "HIGH_TEMPERATURE",
  "severity": "HIGH"
}
```

## Project Structure

```text
smart-home-safety-dashboard/
|
├── backend/
│   ├── src/main/java/com/shamla/smarthome/
│   │   ├── controller/
│   │   │   └── DeviceReadingController.java
│   │   ├── model/
│   │   │   └── DeviceReading.java
│   │   ├── repository/
│   │   │   └── DeviceReadingRepository.java
│   │   └── service/
│   │       ├── DeviceReadingService.java
│   │       └── SafetyRuleEngine.java
│   ├── Dockerfile
│   └── pom.xml
|
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
|
├── docker-compose.yml
└── README.md
```

## Running the Project

### Requirements

- Docker Desktop
- Git

### Clone

```bash
git clone https://github.com/Shamla-Isthikar/smart-home-safety-dashboard.git
cd smart-home-safety-dashboard
```

### Start

```bash
docker compose up --build
```

### Open the Dashboard

```text
http://localhost:8080
```

### Backend API

```text
http://localhost:8081
```

Example:

```text
http://localhost:8081/api/readings
```

### Stop

```bash
docker compose down
```

## Docker Services

```text
Frontend  -> React + Nginx     -> 8080
Backend   -> Spring Boot       -> 8081
Database  -> PostgreSQL        -> 5432
```

## Author

**Shamla Isthikar**

GitHub: https://github.com/Shamla-Isthikar