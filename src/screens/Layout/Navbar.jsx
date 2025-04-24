import React from "react";
import "./Navbar.css";
import home from "../../assets/home.png";
import noti from "../../assets/notification.png";
import search from "../../assets/search.png";
import profile from "../../assets/Profile.png";
import chat from "../../assets/message.png";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Home", icon: home, path: "/feed" },
    { name: "Search", icon: search, path: "/search" },
    { name: "Chats", icon: chat, path: "/chats" },
    { name: "Notifications", icon: noti, path: "/notifications" },
    { name: "Profile", icon: profile, path: "/profile" },
  ];

  return (
    <div>
      <div className="Ziffy">Ziffy</div>
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className="sideBarElements"
          onClick={() => navigate(tab.path)}
          style={{ color: location.pathname === tab.path ? "blue" : "black" }}
        >
          <img src={tab.icon} alt={tab.name} height="30px" />
          {tab.name}
        </div>
      ))}
    </div>
  );
}

export default Navbar;
