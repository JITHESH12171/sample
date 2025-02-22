import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Load dataset
data = pd.read_csv('C:\\Users\\PRANAV\\Downloads\\sample\\client\\AgriAI\\src\\backend\\cropyeild.csv')

# Define features (excluding target variable)
features = [
    'Region', 'Soil_Type', 'Crop', 'Rainfall_mm', 
    'Temperature_Celsius', 'Fertilizer_Used', 'Irrigation_Used', 
    'Weather_Condition', 'Days_to_Harvest'
]

# Ensure Fertilizer_Used and Irrigation_Used are integers (binary)
data['Fertilizer_Used'] = data['Fertilizer_Used'].astype(int)
data['Irrigation_Used'] = data['Irrigation_Used'].astype(int)

# Convert categorical features using pandas’ .factorize()
factorized_mappings = {}
for col in ['Region', 'Soil_Type', 'Crop', 'Weather_Condition']:
    data[col], mapping = pd.factorize(data[col])
    factorized_mappings[col] = mapping  # Store mapping for later use

# Feature and target separation
target_column = 'Yield_tons_per_hectare'
X = data[features]  # Use only the specified features
y = data[target_column]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model: Random Forest Regressor
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Metrics
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Display results
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"R² Score: {r2:.2f}")

# Save the model and factorized mappings
with open('cropyeild.pkl', 'wb') as file:
    pickle.dump({'model': model, 'factorized_mappings': factorized_mappings}, file)
