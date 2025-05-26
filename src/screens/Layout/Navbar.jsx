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

  // Controls notification panel open/close
  const [showNotifications, setShowNotifications] = useState(false);
  // Controls sidebar collapse/expand
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { name: "Home", icon: home, path: "/feed" },
    { name: "Search", icon: search, path: "/search" },
    { name: "Chats", icon: chat, path: "/chat" },
    { name: "Alert", icon: noti, path: null },
    { name: "Profile", icon: profile, path: `/profile/${userId}` },
    { name: "Logout", icon: logout, path: `/` },
  ];

  // When notifications open, automatically collapse sidebar
  // When notifications close, restore sidebar to previous collapse state
  const handleToggleNotifications = () => {
    if (!showNotifications) {
      setIsCollapsed(true);
      setShowNotifications(true);
    } else {
      setShowNotifications(false);
      setIsCollapsed(false);
    }
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div className={`navbar-container ${isCollapsed ? "collapsed" : ""}`}>
        <div>
          <div className="Ziffy">{!isCollapsed ? "Ziffy" : "Z"}</div>
          {tabs.map((tab) => {
            const isActive =
              tab.name === "Profile"
                ? matchPath(`/profile/${userId}`, location.pathname)
                : location.pathname === tab.path;

            return (
              <div
                key={tab.name}
                className={`sideBarElements ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (tab.name === "Alert") {
                    handleToggleNotifications();
                  } else if (tab.path) {
                    navigate(tab.path);
                    setShowNotifications(false);
                    setIsCollapsed(false);
                  }
                }}
              >
                <img src={tab.icon} alt={tab.name} height="30px" />
                {!isCollapsed && <span>{tab.name}</span>}
              </div>
            );
          })}
        </div>

        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      {/* Move NotificationPanel outside navbar-container */}
      {showNotifications && (
        <NotificationPanel
          userId={userId}
          isOpen={showNotifications}
          onClose={() => {
            setShowNotifications(false);
            setIsCollapsed(false);
          }}
          className="notification-panel"
        />
      )}
    </div>
  );
}

export default Navbar;
