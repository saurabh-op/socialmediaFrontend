import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [isAuthenticating, setAuthenticating] = useState(false);
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
    <div className="page-wrapper">
      {isAuthenticating ? (
        "Authenticating ..."
      ) : (
        <div className="grp1">
          <div className="heading">Log in</div>
          <div className="fields">
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={details.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="fields password-field">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={details.password}
                onChange={handleChange}
                required
              />
            </div>
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>{" "}
          <div className="actions">
            {" "}
            <button onClick={handleSubmit} className="actions-btn">
              {isLoading ? "Processing..." : "Verify"}
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="actions-btn"
              disabled={isLoading}
            >
              Create Account
              <FaArrowRight />
            </button>
          </div>{" "}
        </div>
      )}
    </div>
  );
}

export default Login;
