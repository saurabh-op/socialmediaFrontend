import React from "react";
//import "./Navbar.css";
import home from "../../assets/home.png";
import noti from "../../assets/notification.png";
import search from "../../assets/search.png";
import profile from "../../assets/Profile.png";
import chat from "../../assets/message.png";
import { useNavigate, useLocation, matchPath } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userid");

  const tabs = [
    { name: "Home", icon: home, path: "/feed" },
    { name: "Search", icon: search, path: "/search" },
    { name: "Chats", icon: chat, path: "/chat" },
    { name: "Notifications", icon: noti, path: "/notifications" },
    { name: "Profile", icon: profile, path: `/profile/${userId}` },
    { name: "switch", icon: profile, path: `/` },
  ];

  return (
    <div>
      <div className="Ziffy">Ziffy</div>
      {tabs.map((tab) => {
        const isActive =
          tab.name === "Profile"
            ? matchPath(`/profile/${userId}`, location.pathname)
            : location.pathname === tab.path;

        return (
          <div
            key={tab.name}
            className="sideBarElements"
            onClick={() => navigate(tab.path)}
            style={{ color: isActive ? "blue" : "black" }}
          >
            <img src={tab.icon} alt={tab.name} height="30px" />
            {tab.name}
          </div>
        );
      })}
    </div>
  );
}

export default Navbar;
