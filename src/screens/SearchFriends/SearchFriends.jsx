import React, { useState, useEffect } from "react";
import "./SearchFriends.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FriendSearchBox = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // debounce delay

    return () => clearTimeout(handler);
  }, [search]);
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setDebouncedSearch("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setResults([]);
      return;
    }

    async function fetchUsers() {
      try {
        setSearching(true);
        // Replace with your actual API endpoint
        const response = await fetch(
          `http://localhost:8080/api/users/search/${debouncedSearch}`
        );
        const data = await response.json();
        console.log(data);
        setSearching(false);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setSearching(false);
        setResults([]);
      }
    }

    fetchUsers();
  }, [debouncedSearch]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <input
          type="text"
          placeholder="Search for a person..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="search-results">
          {results.length === 0 && search.trim() !== "" && (
            <p className="no-results">
              {searching ? "Searching..." : "No users found."}
            </p>
          )}
          {results.map((user) => (
            <div key={user.id} className="search-result-item">
              <span
                className="user-name"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                {user.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendSearchBox;
