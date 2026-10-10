import { useState } from "react";
import "./App.css";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export default function App() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    setError("");

    if (!WEBHOOK_URL) {
      setError("Please configure your n8n webhook URL in .env.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          dateOfBirth: dob,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      setError(
        `${err.message}. Check the webhook URL, n8n status, and CORS settings.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Weekly Forecast</h1>
        <p>Enter your details to test our n8n integration.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="dob">Date of birth</label>
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Connecting to n8n..." : "Submit"}
          </button>
        </form>

        {error && (
          <div className="error" role="alert">{error}</div>
        )}

        {result && (
  <section className="result">
    <h2>Your Weekly Forecast</h2>
    <p>Hello, {result.fullName}!</p>
    <p><strong>Date of birth:</strong> {result.dateOfBirth}</p>

    <div style={{ whiteSpace: "pre-wrap" }}>
      {result.forecast}
    </div>
  </section>
)}

      </section>
    </main>
  );
}
