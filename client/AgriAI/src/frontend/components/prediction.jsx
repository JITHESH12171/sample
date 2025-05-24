import React, { useState } from 'react';

const Prediction = () => {
  const [formData, setFormData] = useState({
    STATE: '',
    N_SOIL: '',
    P_SOIL: '',
    K_SOIL: '',
    TEMPERATURE: '',
    HUMIDITY: '',
    ph: '',
    RAINFALL: '',
    CROP_PRICE: '',
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const value = formData[field].trim();
      if (!value) newErrors[field] = 'This field is required';
      else if (field === 'STATE' && !/^[a-zA-Z\s]+$/.test(value)) newErrors[field] = 'Only letters allowed';
      else if (['N_SOIL', 'P_SOIL', 'K_SOIL', 'TEMPERATURE', 'HUMIDITY', 'ph', 'RAINFALL', 'CROP_PRICE'].includes(field) && isNaN(value))
        newErrors[field] = 'Enter a valid number';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setApiError(null);
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setPredictionResult(result);
      } else {
        setApiError(result.error || 'Error making prediction');
      }
    } catch (error) {
      setApiError('Server is unreachable. Please try again later.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Crop Prediction System</h1>
        <form onSubmit={handleSubmit}>
          <table style={styles.table}>
            <tbody>
              {[
                { id: 'STATE', label: 'State' },
                { id: 'N_SOIL', label: 'Soil Nitrogen (mg/kg)', type: 'number' },
                { id: 'P_SOIL', label: 'Soil Phosphorus (mg/kg)', type: 'number' },
                { id: 'K_SOIL', label: 'Soil Potassium (mg/kg)', type: 'number' },
                { id: 'TEMPERATURE', label: 'Temperature (°C)', type: 'number' },
                { id: 'HUMIDITY', label: 'Humidity (%)', type: 'number' },
                { id: 'ph', label: 'Soil pH Level', type: 'number' },
                { id: 'RAINFALL', label: 'Rainfall (mm)', type: 'number' },
                { id: 'CROP_PRICE', label: 'Crop Price (USD)', type: 'number' },
              ].map(({ id, label, type = 'text' }) => (
                <tr key={id}>
                  <td style={styles.tableCell}><label htmlFor={id}>{label}</label></td>
                  <td style={styles.tableCell}>
                    <input
                      type={type}
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.errorCell}>{errors[id] && <small style={styles.errorMessage}>{errors[id]}</small>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" style={styles.submitButton}>Predict</button>
        </form>

        {apiError && <div style={styles.errorContainer}><p>{apiError}</p></div>}

        {predictionResult && (
          <div style={styles.resultContainer}>
            <h2 style={styles.resultTitle}>Prediction Results</h2>
            <p><strong>Predicted Crop:</strong> {predictionResult.prediction}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' },
  overlay: { padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableCell: { padding: '10px', borderBottom: '1px solid #ddd' },
  errorCell: { color: 'red', fontSize: '12px' },
  input: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' },
  submitButton: { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' },
  errorContainer: { background: '#ffdddd', color: 'red', padding: '8px', borderRadius: '5px', textAlign: 'center', marginTop: '10px' },
  resultContainer: { marginTop: '10px', padding: '10px', background: '#f1f1f1', borderRadius: '5px', textAlign: 'center' },
  resultTitle: { fontSize: '18px', fontWeight: 'bold' },
};

export default Prediction;
