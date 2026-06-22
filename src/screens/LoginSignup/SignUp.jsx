import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../../config";
// TODO : 3 :Attach a mobile OTP verification service

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(user.phone)) {
      toast.warning("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/signup`, user);
      const data = response.data;
      if (data.message === "userAlreadyExists") {
        toast.warning("User with this email already exists!");
      }
      if (data.message === "usernameTaken") {
        toast.warning("Username is taken, try other username !");
      }
      if (data.message === "userCreated") {
        toast.success("User registered successfully!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userid", data.user.id);
        localStorage.setItem("name", data.user.name);
        localStorage.removeItem("password");
        localStorage.removeItem("email");
        setLoading(false);
        navigate("/feed", { state: user });
      }
      if (data.message === "error") {
        //  console.error("Error creating user:", error);
        toast.error("Something went wrong.");
      }
    } catch (error) {
      // console.error("Error creating user:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="outlinebox">
        <div className="heading">Sign Up</div>
        <div className="fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="fields">
          {" "}
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
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
              value={user.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="actions">
          {" "}
          <button
            onClick={() => navigate("/")}
            className="actions-btn"
            disabled={isLoading}
          >
            <FaArrowLeft />
            Login
          </button>
          <button onClick={handleSubmit} className="actions-btn">
            {isLoading ? "Processing..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
