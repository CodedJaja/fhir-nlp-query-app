import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function PatientSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch suggestions as user types
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/query_suggestions?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Backend error");
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSearch = async (searchQuery) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/query?q=${encodeURIComponent(finalQuery)}`
      );
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch results. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = results.reduce((acc, patient) => {
    const condition = patient.condition || "Unknown";
    const existing = acc.find((c) => c.condition === condition);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ condition, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients (e.g., diabetes)"
          style={{ padding: "0.5rem", width: "250px" }}
          list="suggestions"
        />
        <datalist id="suggestions">
          {suggestions.map((s, idx) => (
            <option key={idx} value={s} />
          ))}
        </datalist>
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <>
          <h2>Patient Results</h2>
          <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "2rem" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Age</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Condition</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{p.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{p.age}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{p.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Conditions Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="condition" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {!loading && results.length === 0 && query && !error && <p>No results found.</p>}
    </div>
  );
}

export default PatientSearch;
