import React, { useState } from 'react';

const Analytics = () => {
  const [formData, setFormData] = useState({
    Region: '',
    Soil_Type: '',
    Crop: '',
    Temperature_Celsius: '',
    Weather_Condition: '',
    Days_to_Harvest: '',
  });

  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const value = formData[field].trim();

      if (!value) {
        newErrors[field] = 'This field is required';
      } else {
        // Validate text fields (only letters and spaces, with length limit)
        if (['Region', 'Soil_Type', 'Crop', 'Weather_Condition'].includes(field)) {
          if (!/^[a-zA-Z\s]+$/.test(value)) {
            newErrors[field] = 'Only letters and spaces are allowed';
          }
          if (value.length > 50) {
            newErrors[field] = 'Maximum 50 characters allowed';
          }
        }

        // Validate numeric fields
        if (['Temperature_Celsius', 'Days_to_Harvest'].includes(field)) {
          if (!/^\d+(\.\d+)?$/.test(value)) {
            newErrors[field] = 'Only numeric values are allowed';
          } else {
            const numValue = parseFloat(value);

            if (numValue < 0) newErrors[field] = 'Value must be non-negative';

            if (field === 'Temperature_Celsius' && (numValue < -50 || numValue > 60)) {
              newErrors[field] = 'Temperature must be between -50 and 60°C';
            }
            if (field === 'Days_to_Harvest' && (numValue < 1 || numValue > 365)) {
              newErrors[field] = 'Days to Harvest must be between 1 and 365';
            }
          }
        }
      }
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
      const response = await fetch('http://localhost:5000/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setAnalyticsResult(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Crop Analytics System</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        {[
          { id: 'Region', label: 'Region' },
          { id: 'Soil_Type', label: 'Soil Type' },
          { id: 'Crop', label: 'Crop' },
          { id: 'Temperature_Celsius', label: 'Temperature (°C)', type: 'number' },
          { id: 'Weather_Condition', label: 'Weather Condition' },
          { id: 'Days_to_Harvest', label: 'Days to Harvest', type: 'number' },
        ].map(({ id, label, type = 'text' }) => (
          <div key={id} className="form-group">
            <label htmlFor={id} className="form-label">
              {label}
            </label>
            <input
              type={type}
              id={id}
              name={id}
              value={formData[id]}
              onChange={handleChange}
              className={`form-input ${errors[id] ? 'error' : ''}`}
            />
            {errors[id] && <small className="error-message">{errors[id]}</small>}
          </div>
        ))}
        <button type="submit" className="submit-button">
          Analyze
        </button>
      </form>

      {analyticsResult && (
        <div className="result-container">
          <h2 className="result-title">Analytics Results</h2>
          <div className="result-details">
            <p><strong>Insights:</strong> {analyticsResult.insights}</p>
            <p><strong>Recommendations:</strong> {analyticsResult.recommendations}</p>
            <p><strong>Statistics:</strong> {analyticsResult.statistics}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
