import React, { useState } from 'react';
import './App.css';
import Sidebar from './frontend/components/sidebar';
import Prediction from './frontend/components/prediction';
import Analytics from './frontend/components/Analytics';
import LoginPage from './frontend/components/login';
import About from './frontend/components/about';
import Profile from './frontend/components/profile'; // Import Profile Component
import Disease from './frontend/components/disease';

const App = () => {
  const [view, setView] = useState('login'); // Default to the login view
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(""); // Store username

  const handleLoginSuccess = (name) => {
    setIsAuthenticated(true);
    setUsername(name); // Set the username from login
    setView('home');
  };

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Sidebar onNavigation={setView} />
          <div className="main-content">
            {view === 'home' && <h1 style={{ color: 'white' }}>Welcome to the Crop Suggestion System</h1>}
            {view === 'prediction' && <Prediction />}
            {view === 'analytics' && <Analytics />}
            {view === 'disease' && <Disease/>}
            {view === 'about' && <About />}
            {view === 'profile' && <Profile username={username} />} {/* Pass username */}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
