import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [details, setUser] = useState({
    username: "",
    password: "",
  });

  // useEffect(() => {
  //   console.log("loging screen");
  //   setAuthenticating(true);
  //   const storedUsername = localStorage.getItem("username");
  //   const storedPassword = localStorage.getItem("password");
  //   console.log("username", storedUsername, "password", storedPassword);

  //   if (storedUsername && storedPassword) {
  //     console.log("verifying creds");
  //     verifyCredentials(storedUsername, storedPassword);
  //   } else {
  //     setAuthenticating(false);
  //   }
  // }, []);

  // const verifyCredentials = async (username, password) => {
  //   try {
  //     const response = await fetch("http://localhost:8080/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     const data = await response.json();
  //     console.log(data);

  //     if (data.mes === "match") {
  //       console.log("match");
  //       setAuthenticating(false);
  //       navigate("/feed");
  //     } else {
  //       setAuthenticating(false);
  //     }
  //   } catch {
  //     setAuthenticating(false);
  //   } finally {
  //     setAuthenticating(false);
  //   }
  // };

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
        localStorage.setItem("password", data.password);

        setLoading(false);
        navigate("/feed");
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
      {isAuthenticating ? (
        "Authenticating ..."
      ) : (
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
      )}
    </div>
  );
}

export default Login;
