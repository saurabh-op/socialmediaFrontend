// SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchFriends.css";
import Navbar from "../Layout/Navbar";
import "./searchList.css";
import "./userPreview.css";
import lock from "../../assets/lock.png";
const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userPreview, setPreview] = useState(null);
  const [isSent, setSent] = useState(false);
  const [isloadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setSearching(true);
        const res = await fetch(
          `http://localhost:8080/api/users/search/${debouncedSearch}`
        );
        const data = await res.json();
        console.log(data);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const getPreview = async (id) => {
    try {
      setLoadingPreview(true);
      const res = await fetch(`http://localhost:8080/api/users/get/${id}`);
      const data = await res.json();
      setSent(false);
      setLoadingPreview(false);
      setPreview(data);
    } catch (error) {
      console.error("Error fetching preview:", error);
    }
  };

  const sendRequest = async (id) => {
    try {
      const myid = localStorage.getItem("userid");
      if (myid != id) {
        const response = await fetch(
          `http://localhost:8080/api/request/send/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderusername: localStorage.getItem("username"),
              sendername: localStorage.getItem("name"),
              senderid: localStorage.getItem("userid"),
              senderimage: "https://randomuser.me/api/portraits/men/75.jpg",
            }),
          }
        );

        const result = await response.text();
        if (result === "sent") {
          setSent(true);
        }
      } else {
        alert("Can't sent requests to youself");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const List = React.memo(() => {
    return (
      <div className="List">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a person..."
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <span className="clear-icon" onClick={() => setSearch("")}>
              &times;
            </span>
          )}
        </div>

        <div className="srchlist">
          {results.length === 0 && search.trim() !== "" && (
            <p className="no-results">
              {searching ? "Searching..." : "No users found."}
            </p>
          )}
          {results.map((user) => (
            <div
              className="srchlistItem"
              key={user.id}
              onClick={() => getPreview(user.id)}
            >
              <img
                className="profilePic"
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="avatar"
              />
              <div className="srch-user-info">
                <strong>{user.username}</strong>
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  });

  function UserPreview() {
    return (
      <div className="userPreview">
        {isloadingPreview ? (
          "Loading ..."
        ) : userPreview ? (
          <div className="srch-profile-container">
            <div className="srch-cont1">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt={userPreview.name}
                className="dp"
              />
              <div className="srch-profile-details">
                <span>
                  <h3>{userPreview.username}</h3>
                </span>
                <span>
                  <h3>{userPreview.name}</h3>
                </span>
                <span>
                  <p>{userPreview.bio}</p>
                </span>
              </div>
            </div>

            <div className="srch-cont2">
              <div className="srch-pvt-actions">
                <p className="srch-pvt">Private Account</p>
                <button
                  className="follow-button"
                  onClick={() => sendRequest(userPreview.id)}
                >
                  {isSent ? "Requested" : "Follow"}
                </button>
              </div>
              <button className="srch-close-btn" onClick={() => setPreview()}>
                ×
              </button>
            </div>
          </div>
        ) : (
          <p className="no-user-selected">Select the user to see details</p>
        )}
      </div>
    );
  }
  return (
    <div className="mainpage">
      <div className="navbar">
        <Navbar />
      </div>
      <List />
      <UserPreview />
    </div>
  );
};

export default SearchPage;
