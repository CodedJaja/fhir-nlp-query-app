const API_BASE = "http://127.0.0.1:8000"; // backend base URL

// Send search query via POST, including optional filters
export async function searchFHIR(query, filters = {}) {
  try {
    const response = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, filters }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in searchFHIR:", error);
    throw error;
  }
}

// Get query suggestions (still GET)
export async function getQuerySuggestions(q) {
  try {
    const response = await fetch(
      `${API_BASE}/query_suggestions?q=${encodeURIComponent(q)}`
    );
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getQuerySuggestions:", error);
    return [];
  }
}
