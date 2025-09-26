import { useState } from "react";
import { searchFHIR, getQuerySuggestions } from "../lib/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ minAge: "", maxAge: "", diagnosis: "" });

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setChartData([]);

    try {
      const data = await searchFHIR(query, filters);
      setResults(data.results || []);
      setChartData(data.chartData || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch results. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with suggestions
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

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

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

      {/* Suggestions */}
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
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          name="minAge"
          value={filters.minAge}
          placeholder="Min Age"
          onChange={handleFilterChange}
          style={{ marginRight: "1rem", padding: "0.3rem" }}
        />
        <input
          type="number"
          name="maxAge"
          value={filters.maxAge}
          placeholder="Max Age"
          onChange={handleFilterChange}
          style={{ marginRight: "1rem", padding: "0.3rem" }}
        />
        <input
          type="text"
          name="diagnosis"
          value={filters.diagnosis}
          placeholder="Diagnosis code"
          onChange={handleFilterChange}
          style={{ padding: "0.3rem" }}
        />
      </div>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2>Charts</h2>
          <PieChart width={400} height={300}>
            <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>

          <h2>Patient Data</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Age</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Condition</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{r.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{r.age}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{r.condition}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
