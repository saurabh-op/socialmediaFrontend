import React from "react";
import "./Navbar.css";

import {
  // IoNotificationsOutline,
  Search,
  UserRound,
  LogOut,
  MessageCircle,
  HomeIcon,
} from "lucide-react";

// import { GoHome } from "react-icons/go";

import { useNavigate, useLocation, matchPath } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userid");

  const tabs = [
    { name: "Home", icon: HomeIcon, path: "/feed" },

    { name: "Search", icon: Search, path: "/search" },

    { name: "Chats", icon: MessageCircle, path: "/chat" },

    // {
    //   name: "Alert",
    //   icon: IoNotificationsOutline,
    //   path: "/notification",
    // },

    {
      name: "Profile",
      icon: UserRound,
      path: `/profile/${userId}`,
    },

    { name: "Logout", icon: LogOut, path: `/` },
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
