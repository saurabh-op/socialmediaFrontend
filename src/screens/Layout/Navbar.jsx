import React from "react";
import "./Navbar.css";

import {
  IoNotificationsOutline,
  IoSearchOutline,
  IoPersonOutline,
  IoExitOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";

import { GoHome } from "react-icons/go";

import { useNavigate, useLocation, matchPath } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userid");

  const tabs = [
    { name: "Home", icon: GoHome, path: "/feed" },

    { name: "Search", icon: IoSearchOutline, path: "/search" },

    { name: "Chats", icon: IoChatbubbleEllipsesOutline, path: "/chat" },

    {
      name: "Alert",
      icon: IoNotificationsOutline,
      path: "/notification",
    },

    {
      name: "Profile",
      icon: IoPersonOutline,
      path: `/profile/${userId}`,
    },

    { name: "Logout", icon: IoExitOutline, path: `/` },
  ];

  return (
    <div className="navbar_left">
      {tabs.map((tab) => {
        const isActive =
          tab.name === "Profile"
            ? matchPath(`/profile/${userId}`, location.pathname)
            : location.pathname === tab.path;

        const IconComponent = tab.icon;

        return (
          <button
            key={tab.name}
            className={`nav_button ${isActive ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            <IconComponent
              size={22}
              className={`nav_icon ${isActive ? "active_icon" : ""}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default Navbar;
