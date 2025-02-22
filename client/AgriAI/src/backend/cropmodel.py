import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# Load dataset
data = pd.read_csv("C:\\Users\\PRANAV\\Downloads\\sample\\client\\AgriAI\\src\\backend\\crop.csv")

# Define features
categorical_features = ['STATE']
numerical_features = ['N_SOIL', 'P_SOIL', 'K_SOIL', 'TEMPERATURE', 'HUMIDITY', 'ph', 'RAINFALL', 'CROP_PRICE']

# Encode STATE using factorize() (Assigns unique number to each state)
data['STATE'], state_mapping = pd.factorize(data['STATE'])

# Define features and target variable
features = numerical_features + ['STATE']
target = 'CROP'

X = data[features]
y = data[target]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train the Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

# Save the model and state mapping for future decoding
with open('crop.pkl', 'wb') as file:
    pickle.dump({'model': model, 'state_mapping': state_mapping}, file)

print("Model saved successfully!")
