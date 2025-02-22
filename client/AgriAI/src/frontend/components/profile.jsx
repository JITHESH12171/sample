import React from "react";

const Profile = ({ username }) => {
  const userHistory = [
    { date: "2024-01-01", action: "Predicted crop: Wheat" },
    { date: "2023-12-15", action: "Viewed analytics for Rice" },
    { date: "2023-11-20", action: "Predicted crop: Corn" },
  ];

  const styles = {
    container: {
        flexDirection: "column", 
        justifyContent: "center", // Align items at the top
        alignItems: "center", 
        height: "90vh",
        width: "60vw",
        margin: "0",
        background: "url('your-image-url.jpg') no-repeat center center", // Add your image URL here
        backgroundSize: "cover", // Ensures it covers the entire viewport
        fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "18px",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f4f4f4",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.subtitle}>Welcome, {username}!</p>
        <p>Your recent activity is listed below:</p>
      </div>
      <div style={styles.card}>
        <h2 style={styles.title}>History</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {userHistory.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.date}</td>
                <td style={styles.td}>{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
