import React from "react";
import "../cssFiles/HomePage.css";
import { useLocation } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const user = location.state;
  return (
    <div className="home-container">
      <div className="profile-card">
        <h2>Welcome, {user.name || "User"} 👋</h2>
        <div className="info">
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
