import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

// TODO : 3 :Attach a mobile OTP verification service

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    userName: "",
    phone: "",
    email: "",
    password: "",
    bio: "",
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
        "http://localhost:8080/api/users/signup",
        user
      );
      const data = response.data;
      if (data.message === "userAlreadyExists") {
        alert("User with this email already exists!");
      }
      if (data.message === "usernameTaken") {
        alert("Username is taken, try other username !");
      }
      if (data.message === "userCreated") {
        console.log("User created:", response.data);
        console.log(response.data.user);

        alert("User registered successfully!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.userName);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("name", data.user.name);

        setLoading(false);
        navigate("/home", { state: user });
      }
      if (data.message === "error") {
        console.error("Error creating user:", error);
        alert("Something went wrong. Check console.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="grp1">
        <div className="heading">Sign Up</div>
        <div className="field">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={user.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <button onClick={handleSubmit} className="register-btn">
          {isLoading ? "Processing..." : "Register"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="register-btn"
          disabled={isLoading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default SignUp;
