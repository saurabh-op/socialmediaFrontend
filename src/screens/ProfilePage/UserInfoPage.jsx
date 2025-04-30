import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserInfoPage.css";
import "../Layout/Common.css";
import Navbar from "../Layout/Navbar";
import axios from "axios";

function UserInfoPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = async () => {
    try {
      console.log("fetching requests ");
      const id = localStorage.getItem("userid");
      const res = await fetch(`http://localhost:8080/api/request/${id}`);

      if (res.status === 204) {
        console.log("No new requests");
        setRequests([]); // empty list
      } else if (res.ok) {
        const data = await res.json();
        console.log(data);
        setRequests(data);
      } else {
        console.error("Failed to fetch requests:", res.status);
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const [user, setUser] = useState({
    profilePicture: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Munna Bhai ",
    username: "Circuit",
    bio: "Love coding and coffee ☕",
    posts: 120,
    followers: 3400,
    following: 180,
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/get/${userId}`
        );
        const data = await response.json();
        console.log("Fetched user is : ", data);
        if (data != null) {
          setUser((prevUser) => ({
            ...prevUser,
            name: data.name,
            username: data.username,
            bio: data.bio,
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/posts/allPosts/${userId}`
        );
        setPosts(res.data.gallery);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const acceptRequest = async (senderId) => {
    const receiverId = localStorage.getItem("userid");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/request/accept/${receiverId}/${senderId}`
      );
      console.log("Request accepted:", response.data);

      setRequests((prev) => prev.filter((req) => req.senderid !== senderId));

      alert("accepted");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  const deleteRequest = async (senderId) => {
    const receiverId = localStorage.getItem("userid");
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/request/delete/${receiverId}/${senderId}`
      );
      console.log("Request accepted:", response.data);

      setRequests((prev) => prev.filter((req) => req.senderid !== senderId));

      alert("deleted");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  return (
    <div className="mainPage">
      <div className="navbar">
        <Navbar />
      </div>

      {loading ? (
        <div className="rightPart">Loading...</div>
      ) : user == null ? (
        <div className="rightPart">User not found</div>
      ) : showModal ? (
        <div className="rightPart">
          <div className="modal">
            <h2 className="modal-title">Friend Requests</h2>
            {requests.length == 0
              ? "No New requests "
              : requests.map((req) => (
                  <div className="modal-item" key={req.senderid ?? "NA"}>
                    <div className="sender-info">
                      <span className="username">
                        {req.senderusername ?? "NA"}
                      </span>
                      <span className="name">({req.sendername ?? "NA"})</span>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="accept-btn"
                        onClick={() => acceptRequest(req.senderid)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => deleteRequest(req.senderid)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="rightPart">
          <div className="profile-container">
            <div className="profile-header">
              <img
                className="profile-pic"
                src={user.profilePicture}
                alt="Profile"
              />
              <div className="profile-info">
                <div className="top-row">
                  <h2>{user.username}</h2>
                  {/* <button className="edit-btn">Edit Profile</button> */}
                </div>
                <div className="stats">
                  <span>
                    <strong>{user.posts}</strong> posts
                  </span>
                  <span>
                    <strong>{user.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{user.following}</strong> following
                  </span>{" "}
                  <button onClick={fetchRequests}>Requests</button>
                </div>
                <div className="bio">
                  <strong>{user.name}</strong>
                  <p>{user.bio}</p>
                </div>
              </div>
            </div>

            <div className="gallery">
              {posts != null
                ? posts.map((post) => (
                    <img
                      className="img"
                      key={post.postId}
                      src={post.imageUrl}
                      alt={post.caption}
                    />
                  ))
                : "No posts"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfoPage;
