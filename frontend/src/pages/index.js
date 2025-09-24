import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to FHIR NLP App</h1>
      <p>
        Go to <Link href="/search">Search Page</Link> to query patients.
      </p>
    </div>
  );
}
