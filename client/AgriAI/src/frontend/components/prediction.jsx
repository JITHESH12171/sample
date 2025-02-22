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
        <form style={styles.formContainer} onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
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
              <div key={id} style={styles.formGroup}>
                <label htmlFor={id} style={styles.formLabel}>{label}</label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  style={styles.formInput}
                />
                {errors[id] && <small style={styles.errorMessage}>{errors[id]}</small>}
              </div>
            ))}
          </div>
          <button type="submit" style={styles.submitButton}>Predict</button>
        </form>

        {apiError && (
          <div style={styles.errorContainer}>
            <p>{apiError}</p>
          </div>
        )}

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

// Inline Styles
const styles = {
  pageContainer: {
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url("https://source.unsplash.com/1600x900/?farm,field")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlay: {
    width: '90%',
    maxWidth: '1100px',
    height: '95vh',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
    overflowY: 'auto',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '10px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '3px',
  },
  formInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background 0.3s',
  },
  errorContainer: {
    background: '#ffdddd',
    color: 'red',
    padding: '8px',
    borderRadius: '5px',
    textAlign: 'center',
    marginTop: '10px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '11px',
    marginTop: '2px',
  },
  resultContainer: {
    marginTop: '10px',
    padding: '10px',
    background: '#f1f1f1',
    borderRadius: '5px',
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Prediction;
