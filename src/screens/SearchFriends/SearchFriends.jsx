// SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchFriends.css";
import Navbar from "../Layout/Navbar";
import "./searchList.css";
import "./userPreview.css";
import "./layout_searchFriends.css";
import lock from "../../assets/lock.png";
import emptyProfilePic from "../../assets/no_profile_pic.png";
import EditProfile from "../edit profile/edit_profile";
const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userPreview, setPreview] = useState(null);
  const [isSent, setSent] = useState(false);
  const [isloadingPreview, setLoadingPreview] = useState(false);
  const [requestedIds, setRequestedIds] = useState(new Set());

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
          `https://ziffyconnect.onrender.com/api/users/search/${debouncedSearch}`
        );
        const data = await res.json();
        console.log("the searche result data is : ", data);
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

  const sendRequest = async (id) => {
    try {
      const myid = localStorage.getItem("userid");
      if (myid != id) {
        const response = await fetch(
          `https://ziffyconnect.onrender.com/api/request/send/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderusername: localStorage.getItem("username"),
              sendername: localStorage.getItem("name"),
              senderid: myid,
              senderimage: "https://randomuser.me/api/portraits/men/75.jpg",
            }),
          }
        );

        const result = await response.text();
        if (result === "sent") {
          setRequestedIds((prev) => new Set(prev).add(id));
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
            placeholder="Enter username or name"
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
              <div className="pic_and_name">
                <img
                  className="profilePic"
                  src={
                    user.profileImageUrl && user.profileImageUrl.trim() !== ""
                      ? user.profileImageUrl
                      : emptyProfilePic
                  }
                  alt="Profile pic"
                />
                <div className="srch-user-info">
                  <strong>{user.username}</strong>
                  <span>{user.name}</span>
                </div>
              </div>

              <div>
                {requestedIds.has(user.id) ? (
                  <button
                    type="button"
                    disabled
                    style={{ background: "#ccc", cursor: "not-allowed" }}
                  >
                    Requested
                  </button>
                ) : (
                  <button type="button" onClick={() => sendRequest(user.id)}>
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="mpage">
      <div className="navbar-container">
        <Navbar />
      </div>

      <List />
      {/* <UserPreview /> */}
    </div>
  );
};

export default SearchPage;
