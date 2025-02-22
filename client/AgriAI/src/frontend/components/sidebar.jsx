import React from 'react';

const Sidebar = ({ onNavigation }) => {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li onClick={() => onNavigation('home')}>Home</li>
        <li onClick={() => onNavigation('prediction')}>Prediction</li>
        <li onClick={() => onNavigation('analytics')}>Analytics</li>
        <li onClick={() => onNavigation('disease')}>Disease Detection</li>
        <li onClick={() => onNavigation('profile')}>Profile</li>
        <li onClick={() => onNavigation('about')}>About</li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
