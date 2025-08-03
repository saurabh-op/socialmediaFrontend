import React from "react";
import "./Navbar.css";

import {
  IoHomeOutline,
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
    { name: "Alert", icon: IoNotificationsOutline, path: "/notification" },
    { name: "Profile", icon: IoPersonOutline, path: `/profile/${userId}` },
    { name: "Logout", icon: IoExitOutline, path: `/` },
  ];

  return (
    <div className="navbar">
      {tabs.map((tab) => {
        const isActive =
          tab.name === "Profile"
            ? matchPath(`/profile/${userId}`, location.pathname)
            : location.pathname === tab.path;

        const IconComponent = tab.icon;

        return (
          <div
            key={tab.name}
            className={`navicon${isActive ? "active" : ""}`}
            onClick={() => {
              if (tab.path) navigate(tab.path);
            }}
          >
            <IconComponent
              size={35}
              className={`navicon${isActive ? "active" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Navbar;
