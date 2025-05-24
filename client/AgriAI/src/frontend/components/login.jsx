import React, { useState } from "react";

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const validateInput = () => {
    const { username, password } = formData;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!username || !password) {
      return "Username and Password are required.";
    }
    if (username.length < 4) {
      return "Username must be at least 4 characters long.";
    }
    if (!usernameRegex.test(username)) {
      return "Username can only contain letters and numbers.";
    }
    if (!passwordRegex.test(password)) {
      return "Password must be at least 6 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
    } else {
      setError("");
      onLoginSuccess(formData.username);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      margin: "0",
      background: "linear-gradient(to right, #6a11cb, #2575fc)",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#4caf50",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    socialButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "10px 0",
      padding: "10px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      textDecoration: "none",
      color: "#000",
      fontSize: "16px",
    },
    logo: {
      height: "20px",
      marginRight: "10px",
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginBottom: "15px",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Welcome Back</h1>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Login
        </button>
        <div>
          <a
            href="https://accounts.google.com/signin"
            style={styles.socialButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google Logo"
              style={styles.logo}
            />
            Sign in with Google
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
