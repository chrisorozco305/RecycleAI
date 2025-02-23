"use client";

import { useEffect, useState } from "react";

const ResultDisplay = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/get_result");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ color: "white", textAlign: "center" }}>
      <h2>Classification Result</h2>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : result ? (
        <div style={{ backgroundColor: "#1A1A1A", padding: "20px", borderRadius: "10px" }}>
          <p><strong>Classification:</strong> {result.classification}</p>
          <p><strong>Detected Objects:</strong> {result.objects}</p>
          <p><strong>Labels:</strong> {result.labels.join(", ")}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResultDisplay;