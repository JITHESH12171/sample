import React from 'react';

const About = () => {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f6f8',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#4caf50',
    color: '#fff',
    width: '100%',
    padding: '10px 20px',
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  };

  const contentStyle = {
    padding: '20px',
    maxWidth: '800px',
    textAlign: 'justify',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#4caf50',
  };

  const sectionTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginTop: '20px',
    color: '#388e3c',
  };

  const paragraphStyle = {
    marginBottom: '15px',
  };

  const listStyle = {
    marginBottom: '15px',
    listStyleType: 'disc',
    paddingLeft: '20px',
  };

  const highlightStyle = {
    color: '#4caf50',
    fontWeight: 'bold',
  };

  const quoteStyle = {
    fontStyle: 'italic',
    backgroundColor: '#e8f5e9',
    padding: '10px',
    borderLeft: '5px solid #4caf50',
    marginBottom: '20px',
  };

  return (
    <div style={pageStyle}>
      {/* Sticky Header */}
      <header style={headerStyle}>About Agri AI</header>

      {/* Content Section */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>Welcome to Agri AI</h1>
        <p style={paragraphStyle}>
          <span style={highlightStyle}>Agri AI</span> is a cutting-edge artificial intelligence platform tailored to revolutionize 
          the agricultural industry. By combining the power of data science, machine learning, and user-friendly design, 
          Agri AI helps stakeholders make smarter, more sustainable decisions.
        </p>

        <blockquote style={quoteStyle}>
          "Empowering farmers with technology to cultivate a better future for everyone."
        </blockquote>

        <h2 style={sectionTitleStyle}>Key Features</h2>
        <ul style={listStyle}>
          <li>Accurate <span style={highlightStyle}>data analytics</span> to identify optimal crops based on soil and weather conditions.</li>
          <li>Advanced <span style={highlightStyle}>weather forecasting</span> to plan planting and harvesting schedules effectively.</li>
          <li>Insights into soil fertility and recommendations for <span style={highlightStyle}>fertilizer application</span>.</li>
        </ul>

        <h2 style={sectionTitleStyle}>Broader Vision</h2>
        <p style={paragraphStyle}>
          Agri AI aims to reduce environmental impact, increase productivity, and support global food security through modern technology.
        </p>
      </div>
    </div>
  );
};

export default About;
