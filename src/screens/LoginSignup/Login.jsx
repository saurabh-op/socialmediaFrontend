import React, { useState } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { useWebSocket } from "../../services/webSocketContext";
import { API_BASE_URL } from "../../config";
function Login() {
  const { connect, disconnect } = useWebSocket();
  const navigate = useNavigate();
  const [isAuthenticating] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [details, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users/login", details);
      const data = response.data;

      if (data.mes === "match") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userid", data.id);
        localStorage.removeItem("password");
        localStorage.removeItem("email");
        disconnect();
        connect(data.id);
        setLoading(false);
        navigate("/feed");
      }
      if (data.mes === "invalid") {
        toast.error("Invalid Credentials");
        setUser({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Error during loging the user:", error);
      toast.error("Something went wrong.");
      setUser({
        username: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {isAuthenticating ? (
        "Authenticating ..."
      ) : (
        <div className="login-card">
          <div className="login-heading">
            <span className="login-eyebrow">Welcome back</span>
            <h1>Log in to your account</h1>
            <p>Pick up where you left off and stay connected with your people.</p>
          </div>
          <div className="login-fields">
            <div className="login-field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={details.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-field login-password-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={details.password}
                onChange={handleChange}
                required
              />
              <span
                className="login-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="login-actions">
            <button
              onClick={handleSubmit}
              className="login-action-button verify-button"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Log in"}
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="login-action-button create-button"
              disabled={isLoading}
            >
              Create account
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
