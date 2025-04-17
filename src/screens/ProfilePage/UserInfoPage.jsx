import React, { useEffect, useState } from "react";
import "../cssFiles/UserInfoPage.css";

function UserInfoPage({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/get/${userId}`
        );
        const data = await response.json();
        console.log("Fetched user is : ", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading-indicator">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-container">
        <div className="error-message">User not found.</div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="profile-picture-section">
          <img
            src={user.profilePicture || "/default-profile.png"}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <div className="user-info-section">
          <h1 className="user-name">{user.name}</h1>
          <p className="user-username">@{user.userName}</p>
          <p className="user-email">{user.email}</p>
          <p className="user-bio">{user.bio || "No bio available."}</p>
        </div>
      </div>
    </div>
  );
}

export default UserInfoPage;
