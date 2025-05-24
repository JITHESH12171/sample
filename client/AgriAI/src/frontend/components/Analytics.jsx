import React, { useState } from "react";

const Analytics = () => {
  const [formData, setFormData] = useState({
    Region: "",
    Soil_Type: "",
    Crop: "",
    Rainfall_mm: "",
    Temperature_Celsius: "",
    Fertilizer_Used: false,
    Irrigation_Used: false,
    Weather_Condition: "",
    Days_to_Harvest: "",
  });

  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalyticsResult(null);
    try {
      const response = await fetch("http://localhost:5000/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const result = await response.json();
      setAnalyticsResult(result);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalyticsResult({ error: "Failed to fetch analytics data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Crop Yield Prediction</h1>
        <form onSubmit={handleSubmit}>
          <table style={styles.table}>
            <tbody>
              {Object.entries(formData).map(([field, value]) => (
                <tr key={field}>
                  <td style={styles.tableCell}>
                    <label htmlFor={field}>{field.replace(/_/g, " ")}</label>
                  </td>
                  <td style={styles.tableCell}>
                    {typeof value === "boolean" ? (
                      <input
                        type="checkbox"
                        id={field}
                        name={field}
                        checked={value}
                        onChange={handleChange}
                        style={styles.checkbox}
                      />
                    ) : (
                      <input
                        type={/Rainfall_mm|Temperature_Celsius|Days_to_Harvest/.test(field) ? "number" : "text"}
                        id={field}
                        name={field}
                        value={value}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {analyticsResult && (
          <div style={styles.resultContainer}>
            <h2 style={styles.resultTitle}>Prediction Result</h2>
            {analyticsResult.error ? (
              <p style={styles.errorMessage}>{analyticsResult.error}</p>
            ) : (
              <p>
                <strong>Predicted Crop Yield:</strong> {analyticsResult.prediction.toFixed(2)} tons/hectare
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f4f4" },
  overlay: { padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableCell: { padding: "10px", borderBottom: "1px solid #ddd" },
  input: { width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "5px" },
  checkbox: { height: "20px", width: "20px" },
  submitButton: { width: "100%", padding: "10px", marginTop: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" },
  resultContainer: { marginTop: "10px", padding: "10px", background: "#f1f1f1", borderRadius: "5px", textAlign: "center" },
  resultTitle: { fontSize: "18px", fontWeight: "bold" },
  errorMessage: { color: "red" },
};

export default Analytics;