import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/suggestions")
      .then(res => res.json())
      .then(data => setSuggestions(data.suggestions))
      .catch(err => console.error("Failed to fetch suggestions", err));
  }, []);

  const handleSearch = async (value) => {
    if (!value.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://127.0.0.1:8000/query?q=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch results. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Aggregate patient count per condition
  const conditionCounts = results.reduce((acc, patient) => {
    acc[patient.condition] = (acc[patient.condition] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(conditionCounts),
    datasets: [
      {
        label: "Number of Patients",
        data: Object.values(conditionCounts),
        backgroundColor: Object.keys(conditionCounts).map(
          () => `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`
        ),
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>FHIR NLP Query App</h1>

      <Autocomplete
        freeSolo
        options={suggestions}
        inputValue={query}
        onInputChange={(event, newInputValue) => setQuery(newInputValue)}
        onChange={(event, newValue) => handleSearch(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search patients"
            variant="outlined"
            style={{ width: 300, marginBottom: "1rem" }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          />
        )}
      />

      {loading && <p>Searching...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <>
          <div style={{ width: "600px", marginBottom: "2rem" }}>
            <Bar data={chartData} />
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Condition</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default App;
