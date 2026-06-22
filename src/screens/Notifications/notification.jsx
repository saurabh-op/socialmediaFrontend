import React, { useEffect, useState } from "react";
import "./notification.css";
import "./layout_notif.css";
import Navbar from "../Layout/Navbar";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now - time) / 1000);

    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} m`;
    const years = Math.floor(months / 12);
    return `${years} y`;
  };

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    fetch(
      `${API_BASE_URL}/notifications/all?notificationHolderId=${userId}`,
    )
      .then((res) => res.json())
      .then(setNotifications)
      .catch(console.error);
  }, []);

  return (
    <div className="mainpage">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="Notif-rightSide">
        <ul>
          {notifications.length === 0 ? (
            <li>No notifications</li>
          ) : (
            notifications.map((n) => (
              <li key={n.notificationId} className="listobj">
                <div className="notification-item-top">
                  <div className="notification-sender">{n.userName}</div>
                  <small className="notification-time">
                    {getTimeAgo(n.time)}
                  </small>
                </div>
                <div className="notification-message">{n.message}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
