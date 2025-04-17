import React, { useState, useEffect } from "react";

import "./Home.css";
import home from "../../assets/home.png";
import noti from "../../assets/notification.png";
import search from "../../assets/search.png";
import profile from "../../assets/Profile.png";
import chat from "../../assets/message.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // const fetchRequests = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/api/requests/{userid}"
  //     );
  //     const data = await response.json();
  //     setRequests(data); // assuming API returns only requestList array
  //     setShowRequests(true);
  //   } catch (error) {
  //     console.error("Failed to fetch requests", error);
  //   }
  // };
  // const acceptRequest = (senderId) => {
  //   // call accept API here
  //   console.log("Accepted request from", senderId);
  // };

  // const rejectRequest = async (senderId) => {
  //   try {
  //     await fetch(`http://localhost:8080/api/requests/delete/${senderId}`, {
  //       method: "DELETE",
  //     });
  //     setRequests((prev) => prev.filter((r) => r.senderid !== senderId));
  //   } catch (error) {
  //     console.error("Failed to reject request", error);
  //   }
  // };
  return (
    <div className="mainPage">
      <div className="sideBar">
        <div className="Ziffy">Ziffy</div>
        <div className="sideBarElements">
          <img src={home} alt="Home" height="30px" /> Home
        </div>
        <div className="sideBarElements">
          {" "}
          <img src={search} alt="Home" height="30px" />
          Search
        </div>
        <div className="sideBarElements">
          {" "}
          <img src={chat} alt="Home" height="30px" />
          Chats
        </div>
        <div className="sideBarElements">
          {" "}
          <img src={noti} alt="Home" height="30px" />
          <span>Notifications</span>
        </div>
        <div className="sideBarElements">
          {" "}
          <img src={profile} alt="Home" height="30px" />
          Profile
        </div>
      </div>
      <div>Feed</div>
    </div>
  );
};

export default Home;
