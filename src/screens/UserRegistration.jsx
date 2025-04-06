import React, { useState } from "react";
import axios from "axios";

function UserForm() {
  const [user, setUser] = useState({
    name: "",
    username: "",
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
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/create",
        user
      );
      console.log("User created:", response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Register User</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={user.name}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={user.username}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={user.phone}
        onChange={handleChange}
      />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
        required
      />
      <br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
        required
      />
      <br />

      <textarea
        name="bio"
        placeholder="Short Bio"
        value={user.bio}
        onChange={handleChange}
        rows="4"
      />
      <br />

      <button type="submit">Register</button>
    </form>
  );
}

export default UserForm;
