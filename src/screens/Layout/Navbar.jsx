import React, { useState } from "react";
import "./Navbar.css";

import home from "../../assets/home.png";
import noti from "../../assets/notification.png";
import search from "../../assets/search.png";
import profile from "../../assets/Profile.png";
import logout from "../../assets/logout.png";
import chat from "../../assets/message.png";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import NotificationPanel from "../Notifications/notification";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userid");

  const tabs = [
    { name: "Home", icon: home, path: "/feed" },
    { name: "Search", icon: search, path: "/search" },
    { name: "Chats", icon: chat, path: "/chat" },
    { name: "Alert", icon: noti, path: "/notification" },
    { name: "Profile", icon: profile, path: `/profile/${userId}` },
    { name: "Logout", icon: logout, path: `/` },
  ];

  return (
    <div>
      <div className="navbar">
        {tabs.map((tab) => {
          const isActive =
            tab.name === "Profile"
              ? matchPath(`/profile/${userId}`, location.pathname)
              : location.pathname === tab.path;

          return (
            <div
              key={tab.name}
              className={`icon ${isActive ? "active" : ""}`}
              onClick={() => {
                if (tab.path) {
                  navigate(tab.path);
                }
              }}
            >
              <img src={tab.icon} height="30px" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Navbar;
