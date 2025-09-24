import dynamic from "next/dynamic";

// Dynamically import the PatientSearch component to avoid SSR issues with Recharts
const PatientSearch = dynamic(() => import("../src/api"), { ssr: false });

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>FHIR NLP Query Dashboard</h1>
      <PatientSearch />
    </div>
  );
}
