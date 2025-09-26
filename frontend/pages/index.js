import { useState, useEffect } from "react";
import { searchFHIR, getQuerySuggestions } from "../lib/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setFilteredResults([]);

    try {
      const data = await searchFHIR(query);
      setResults(data.results || []);
      setFilteredResults(data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch results. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Handle query input for suggestions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      try {
        const sug = await getQuerySuggestions(value);
        setSuggestions(sug);
      } catch (err) {
        console.error("Suggestion fetch failed:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle filtering by age and diagnosis
  useEffect(() => {
    let filtered = [...results];
    if (minAge) filtered = filtered.filter(r => r.age >= parseInt(minAge));
    if (maxAge) filtered = filtered.filter(r => r.age <= parseInt(maxAge));
    if (diagnosis) filtered = filtered.filter(r => r.condition === diagnosis);
    setFilteredResults(filtered);
  }, [minAge, maxAge, diagnosis, results]);

  // Prepare chart data
  const pieData = filteredResults.reduce((acc, curr) => {
    const existing = acc.find(d => d.name === curr.condition);
    if (existing) existing.value += 1;
    else acc.push({ name: curr.condition, value: 1 });
    return acc;
  }, []);

  const barData = filteredResults.reduce((acc, curr) => {
    const existing = acc.find(d => d.name === curr.condition);
    if (existing) existing.value += 1;
    else acc.push({ name: curr.condition, value: 1 });
    return acc;
  }, []);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>FHIR NLP Query Dashboard</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Type your medical query..."
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button type="submit" style={{ marginLeft: "1rem", padding: "0.5rem" }}>
          Search
        </button>
      </form>

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => setQuery(s)} style={{ cursor: "pointer" }}>
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* Filters */}
      <div style={{ margin: "1rem 0" }}>
        <label>
          Min Age: <input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Max Age: <input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Diagnosis: <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
        </label>
      </div>

      {/* Error & loading */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Results Table */}
      {filteredResults.length > 0 && (
        <div>
          <h2>Patient Table</h2>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.age}</td>
                  <td>{r.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pie Chart */}
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          {/* Bar Chart */}
          <BarChart width={500} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>
        </div>
      )}
    </div>
  );
}
