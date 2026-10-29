import React from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import "./welcome.css";

function WelcomeCard() {
  const navigate = useNavigate();
  const my_userid = localStorage.getItem("userid");
  return (
    <main className="home-main">
      <div className="welcome-card">
        <div className="logo-box">
          <Sparkles className="logo-icon" strokeWidth={1.75} />
        </div>

        <div className="welcome-text">
          <span className="welcome-eyebrow">Your feed starts here</span>
          <h1>Welcome onboard</h1>

          <p>
            Your feed is quiet for now. Find people you know, complete your
            profile, and make this space yours.
          </p>
        </div>

        <div className="action-buttons_welcomepage">
          <button
            className="searchfriendscard"
            onClick={() => navigate("/search")}
          >
            <Search size={16} />
            Search friends
          </button>

          <button
            className="completeprofilecard"
            onClick={() => navigate(`/profile/${my_userid}`)}
          >
            <User size={16} />
            Complete profile
          </button>
        </div>

        <ol className="steps-list">
          <li>
            <span>01</span>
            Search for friends by name or username.
          </li>

          <li>
            <span>02</span>
            Send a friend request and wait for them to accept.
          </li>

          <li>
            <span>03</span>
            Their new posts will appear right here in your feed.
          </li>
        </ol>
      </div>
    </main>
  );
}

export default WelcomeCard;
