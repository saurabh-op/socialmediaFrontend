import React, { useEffect, useState } from "react";
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
  const [showServerNote, setShowServerNote] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowServerNote(false);
      return undefined;
    }

    const noteTimer = setTimeout(() => {
      setShowServerNote(true);
    }, 5000);

    return () => clearTimeout(noteTimer);
  }, [isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const submitSignup = async (signupDetails) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/signup`,
        signupDetails,
      );
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
        navigate("/feed", { state: signupDetails });
      }
      if (data.message === "error") {
        //  console.error("Error creating user:", error);
        toast.error("Something went wrong.");
      }
    } catch {
      // console.error("Error creating user:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(user.phone)) {
      toast.warning("Phone number must be exactly 10 digits.");
      return;
    }
    await submitSignup(user);
  };

  const handleDemoSignup = async () => {
    if (isLoading) return;

    const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const demoDetails = {
      name: "Demo User",
      username: `demo_user_${uniqueId}`,
      phone: `9${String(Date.now()).slice(-8)}${Math.floor(Math.random() * 10)}`,
      email: `demo.${uniqueId}@example.com`,
      password: `Demo@${uniqueId}`,
    };

    setUser(demoDetails);
    toast.info("Fresh demo details generated. Creating the account...");
    await submitSignup(demoDetails);
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-heading">
          <span className="signup-eyebrow">Join the community</span>
          <h1>Create your account</h1>
          <p>Build your profile and stay connected with your people.</p>
        </div>
        <section className="demo-section demo-highlight">
          <div className="demo-copy">
            <div className="section-kicker">Fast track</div>
            <h2>Dummy signup</h2>
            <p className="section-description">
              Explore the app with fresh dummy details.
            </p>
          </div>
          
            <button
              type="button"
              className="demo-button"
              onClick={handleDemoSignup}
              disabled={isLoading}
            >
              {isLoading ? "Demo signup in progress..." : "Demo Signup"}
            </button>
                   
        </section>
        <div className="signup-divider">
          <span>OR</span>
        </div>
        <section className="manual-section">
          <div className="manual-heading">
            <h2>Sign up normally</h2>
            <p className="section-description">
              Use your own details to create an account.
            </p>
          </div>
          <div className="signup-fields">
          <div className="signup-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              placeholder="Your name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-field">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-field">
            <label htmlFor="signup-phone">Phone number</label>
            <input
              id="signup-phone"
              type="tel"
              name="phone"
              placeholder="10-digit phone number"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-field">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-field signup-password-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a secure password"
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
          <div className="signup-actions">
            <button
              onClick={() => navigate("/")}
              className="signup-button login-button"
              disabled={isLoading}
            >
              <FaArrowLeft />
              Login
            </button>
            <button
              onClick={handleSubmit}
              className={`signup-button register-button ${isLoading ? "is-loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
          </div>
        </section>
        {showServerNote && (
          <p className="server-note">
            The server is starting. This project is hosted on a free-tier
            backend, so please be patient.
          </p>
        )}
      </div>
    </div>
  );
}

export default SignUp;
