
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081/api/readings";

function App() {
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState({
    deviceId: "",
    temperature: "",
    powerWatts: "",
    status: "ON",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReadings = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load readings");
      const data = await response.json();

      const enriched = await Promise.all(
        data.map(async (reading) => {
          const safetyResponse = await fetch(
            `${API_URL}/${reading.id}/safety`
          );
          const safety = await safetyResponse.json();

          return { ...reading, safety };
        })
      );

      setReadings(enriched);
    } catch (err) {
      setError("Unable to connect to the SmartHome Safety Service.");
    }
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: form.deviceId,
          temperature: Number(form.temperature),
          powerWatts: Number(form.powerWatts),
          status: form.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create reading");
      }

      setForm({
        deviceId: "",
        temperature: "",
        powerWatts: "",
        status: "ON",
      });

      await loadReadings();
    } catch (err) {
      setError("Failed to submit device reading.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (alert) => {
    if (alert === "SAFE") return "safe";
    return "danger";
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">SMART HOME MONITORING</p>
          <h1>Safety Dashboard</h1>
          <p className="subtitle">
            Monitor IoT device readings and detect abnormal conditions.
          </p>
        </div>

        <div className="service-status">
          <span className="status-dot"></span>
          Safety Service Online
        </div>
      </header>

      <main className="dashboard">
        <section className="card form-card">
          <div className="card-header">
            <div>
              <h2>Device Reading</h2>
              <p>Submit a new sensor reading for safety evaluation.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Device ID
                <input
                  name="deviceId"
                  value={form.deviceId}
                  onChange={handleChange}
                  placeholder="e.g. AC-01"
                  required
                />
              </label>

              <label>
                Temperature (°C)
                <input
                  type="number"
                  name="temperature"
                  value={form.temperature}
                  onChange={handleChange}
                  placeholder="25"
                  required
                />
              </label>

              <label>
                Power (W)
                <input
                  type="number"
                  name="powerWatts"
                  value={form.powerWatts}
                  onChange={handleChange}
                  placeholder="1000"
                  min="0"
                  required
                />
              </label>

              <label>
                Device Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Evaluate Reading"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h2>Recent Readings</h2>
              <p>Latest device activity and safety evaluations.</p>
            </div>

            <span className="count">{readings.length} readings</span>
          </div>

          {readings.length === 0 ? (
            <div className="empty">
              <p>No device readings yet.</p>
              <span>Submit a reading above to begin monitoring.</span>
            </div>
          ) : (
            <div className="readings">
              {readings.map((reading) => (
                <div className="reading" key={reading.id}>
                  <div className="device-info">
                    <strong>{reading.deviceId}</strong>
                    <span>{reading.status}</span>
                  </div>

                  <div className="metric">
                    <small>Temperature</small>
                    <strong>{reading.temperature}°C</strong>
                  </div>

                  <div className="metric">
                    <small>Power</small>
                    <strong>{reading.powerWatts} W</strong>
                  </div>

                  <div
                    className={`safety ${getStatusClass(
                      reading.safety?.alert
                    )}`}
                  >
                    <strong>{reading.safety?.alert || "CHECKING"}</strong>
                    <span>
                      {reading.safety?.severity || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        SmartHome Safety Service · React + Spring Boot + PostgreSQL
      </footer>
    </div>
  );
}
export default App;