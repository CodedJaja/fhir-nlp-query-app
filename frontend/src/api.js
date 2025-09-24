import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/query?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        throw new Error("Backend error or route not found");
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(
        "Failed to fetch results. Make sure the backend is running and CORS is enabled."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>FHIR NLP Query App</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients (e.g., diabetes)"
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((patient) => (
          <li key={patient.id}>
            <strong>{patient.name}</strong> — Age: {patient.age}, Condition:{" "}
            {patient.condition}
          </li>
        ))}
      </ul>

      {!loading && results.length === 0 && query && !error && (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default App;
