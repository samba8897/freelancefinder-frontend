import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput !== generatedCaptcha) {
      setError("Invalid CAPTCHA. Please try again.");
      setGeneratedCaptcha(generateCaptcha());
      return;
    }

    try {
      const res = await newRequest.post("/auth/login", { username, password });
      const { token, _id, ...user } = res.data;  // Ensure _id is included

      user.token = token; 
      localStorage.setItem("currentUser", JSON.stringify({ ...user, _id })); // Store user details with token and userId
      localStorage.setItem("token", token); // Store token separately if needed

      navigate("/"); // Redirect to the main page or dashboard
    } catch (err) {
      setError(err.response?.data || "An error occurred during login");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johnwick"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <label htmlFor="captcha">Enter CAPTCHA: {generatedCaptcha}</label>
        <input
          name="captcha"
          type="text"
          placeholder="Enter the CAPTCHA above"
          onChange={(e) => setCaptchaInput(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Join Us</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
