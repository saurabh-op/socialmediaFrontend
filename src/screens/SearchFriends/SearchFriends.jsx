// SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchListPlaceHolder from "./listPlaceHolder.jsx";
import Navbar from "../Layout/Navbar";
import { X } from "lucide-react";
import { UserPlus } from "lucide-react";
import "./searchList.css";
import "./UserPreview.css";
import "./pagelayout.css";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();

  const goToProfile = (userId, e) => {
    e?.stopPropagation();
    navigate(`/viewuser/${userId}`);
  };
  useEffect(() => {
    if (search.trim() === "" || search === null) setSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
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
          `http://localhost:8080/api/users/search/${debouncedSearch}`,
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
      const myProfileurl = localStorage.getItem("user-profile-pic");
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
              senderid: myid,
              senderimage: myProfileurl ? myProfileurl : "",
            }),
          },
        );

        const result = await response.text();
        if (result === "sent") {
          setRequestedIds((prev) => new Set(prev).add(id));
        }
      } else {
        toast.warning("Can't sent requests to youself");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const List = React.memo(() => {
    return (
      <div className="sfcontent">
        <div className="search-box">
          <input
            type="text"
            className="finduser"
            placeholder="Search a friend"
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-icon"
              onClick={() => setSearch("")}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="resultlist">
          {searching ? (
            <SearchListPlaceHolder />
          ) : (
            <>
              {results.length === 0 && search.trim() !== "" && (
                <p className="no-results">No users found.</p>
              )}

              {results.map((user) => (
                <div className="srchlistItem" key={user.id}>
                  <div
                    className="pic_and_name"
                    onClick={(e) => goToProfile(user.id, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="picture"
                      src={
                        user.profileImageUrl &&
                        user.profileImageUrl.trim() !== ""
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
                      <Button disabled className="requested-btn">
                        Requested
                      </Button>
                    ) : (
                      <Button
                        onClick={() => sendRequest(user.id)}
                        className="friend-btn"
                      >
                        <UserPlus size={24} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="sfmpage">
      <Navbar />
      <List />
    </div>
  );
};

export default SearchPage;
