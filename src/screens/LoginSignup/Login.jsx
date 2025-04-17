import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
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
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        details
      );
      const data = response.data;

      if (data.mes === "match") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userid", data.id);

        setLoading(false);
        navigate("/home");
      }
      if (data.mes === "invalid") {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during loging the user:", error);
      alert("Something went wrong.");
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
      <div className="grp1">
        <div className="heading">Log in</div>

        <div className="field">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={details.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={details.password}
            onChange={handleChange}
            required
          />
        </div>
        <button onClick={handleSubmit} className="register-btn">
          {isLoading ? "Processing..." : "Verify"}
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="register-btn"
          disabled={isLoading}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;
