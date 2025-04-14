import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../cssFiles/UserRegistration.css";

function UserForm() {
  const navigate = useNavigate();
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

  function saveUserToLocal() {
    localStorage.setItem("userId", userId);
    localStorage.setItem("authToken", token);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/create",
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
        alert("User registered successfully!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.userName);
        var uuu = localStorage.getItem("username");
        console.log("username is set to", uuu);

        navigate("/home", { state: user });
      }
      if (data.message === "error") {
        console.error("Error creating user:", error);
        alert("Something went wrong. Check console.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="grp1">
        <div className="heading">Sign in</div>
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
        <div className="field">
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={user.bio}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <button onClick={handleSubmit} className="register-btn">
          Register
        </button>
      </div>
    </div>
  );
}

export default UserForm;
