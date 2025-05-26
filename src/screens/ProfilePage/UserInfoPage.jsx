import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserInfoPage.css";
import "./posts.css";
import "./Modal.css";
import "./postDetails.css";
import "../Layout/Common.css";
import Navbar from "../Layout/Navbar";
import axios from "axios";

function UserInfoPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "followers" or "following"
  const [modalList, setModalList] = useState([]);

  // Post details modal
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [selectedPostImageLink, setSelectedPostImageLink] = useState("");
  const [selectedPostTimestamp, setSelectedPostTimestamp] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostUsername, setSelectedPostUsername] = useState("");
  const [selectedPostCaption, setSelectedPostCaption] = useState("");
  const [selectedPostLikesCount, setSelectedPostLikesCount] = useState(0);
  const [selectedPostCommentsCount, setSelectedPostCommentsCount] = useState(0);
  const [selectedPostLikesList, setSelectedPostLikesList] = useState([]);
  const [selectedPostCommentsList, setSelectedPostCommentsList] = useState([]);
  const [view, setView] = useState("comments");

  const fetchRequests = async () => {
    try {
      console.log("fetching requests ");
      const id = localStorage.getItem("userid");
      const res = await fetch(
        `https://ziffyconnect.onrender.com/api/request/${id}`
      );

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
        // Fetch basic user info
        const userRes = await fetch(
          `https://ziffyconnect.onrender.com/api/users/get/${userId}`
        );
        const userData = await userRes.json();
        console.log("Fetched user is:", userData);

        if (userData != null) {
          setUser((prevUser) => ({
            ...prevUser,
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
          }));
        }

        // Parallel fetches for counts
        const [followersRes, followingRes, postsRes] = await Promise.all([
          fetch(
            `https://ziffyconnect.onrender.com/api/follower/count/${userId}`
          ),
          fetch(
            `https://ziffyconnect.onrender.com/api/following/count/${userId}`
          ),
          fetch(`https://ziffyconnect.onrender.com/api/posts/count/${userId}`),
        ]);

        const [followers, following, posts] = await Promise.all([
          followersRes.json(),
          followingRes.json(),
          postsRes.json(),
        ]);

        setUser((prevUser) => ({
          ...prevUser,
          followers,
          following,
          posts,
        }));
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
          `https://ziffyconnect.onrender.com/api/posts/allPosts/${userId}`
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
        `https://ziffyconnect.onrender.com/api/request/accept/${receiverId}/${senderId}`
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
        `https://ziffyconnect.onrender.com/api/request/delete/${receiverId}/${senderId}`
      );
      console.log("Request accepted:", response.data);

      setRequests((prev) => prev.filter((req) => req.senderid !== senderId));

      alert("deleted");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (!isModalOpen) return;
    const endpoint =
      modalType === "followers"
        ? `https://ziffyconnect.onrender.com/api/follower/${userId}`
        : `https://ziffyconnect.onrender.com/api/following/${userId}`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) =>
        setModalList(
          modalType === "followers"
            ? data.followersList || []
            : data.followingList || []
        )
      )
      .catch((err) => console.error(`Error fetching ${modalType}:`, err));
  }, [isModalOpen]);

  function requestModal() {
    return (
      <div className="rightSide">
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
    );
  }

  function profileDetails() {
    return (
      <div className="rightSide">
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
                <span
                  className="clickable"
                  onClick={() => openModal("followers")}
                >
                  <strong>{user.followers}</strong> followers
                </span>
                <span
                  className="clickable"
                  onClick={() => openModal("following")}
                >
                  <strong>{user.following}</strong> following
                </span>
                <button onClick={fetchRequests}>Requests</button>
              </div>
              <div className="bio">
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </div>
            </div>
          </div>
          {gallery()}
        </div>
        {isModalOpen && <ModalGenerator />}
        {showPostDetails && <PostDetails />}
      </div>
    );
  }

  function gallery() {
    return (
      <div className="gallery">
        {posts != null
          ? posts.map((post) => (
              <img
                onClick={() => {
                  handlePostClick(post);
                }}
                className="img"
                key={post.postId}
                src={post.imageUrl}
                alt={post.caption}
              />
            ))
          : "No posts"}
      </div>
    );
  }
  async function handlePostClick(post) {
    setShowPostDetails(true);
    setSelectedPostImageLink(post.imageUrl);
    setSelectedPostId(post.postId);
    setSelectedPostCaption(post.caption);
    setSelectedPostTimestamp(post.timestamp);
    setSelectedPostUsername(post.owner);

    try {
      const [likeRes, commentRes] = await Promise.all([
        fetch(
          `https://ziffyconnect.onrender.com/api/like/likeDetails/${post.postId}`
        ),
        fetch(
          `https://ziffyconnect.onrender.com/api/comment/commentDetails/${post.postId}`
        ),
      ]);

      const likeData = await likeRes.json();
      const commentData = await commentRes.json();

      setSelectedPostLikesCount(likeData.likeCount);
      setSelectedPostLikesList(likeData.likelist || []);

      setSelectedPostCommentsCount(commentData.commentCount);
      setSelectedPostCommentsList(commentData.commentList || []);
    } catch (err) {
      console.error("Error fetching like/comment details:", err);
    }
  }

  function PostDetails() {
    return (
      <div className="post-details-overlay">
        <div className="post-details-container">
          {/* Left - Image */}
          <div className="post-details-left">
            {selectedPostImageLink && (
              <img src={selectedPostImageLink} alt="post" />
            )}
          </div>

          {/* Right - Info */}
          <div className="post-details-right">
            <div className="username">{selectedPostUsername}</div>
            <div className="caption">{selectedPostCaption}</div>
            <div className="timestamp">
              {new Date(selectedPostTimestamp).toLocaleString()}
            </div>

            <div className="icon-row">
              <button
                className={view === "likes" ? "active" : ""}
                onClick={() => setView("likes")}
              >
                ❤️ {selectedPostLikesCount}
              </button>
              <button
                className={view === "comments" ? "active" : ""}
                onClick={() => setView("comments")}
              >
                💬 {selectedPostCommentsCount}
              </button>
            </div>

            <div className="list-container">
              {view === "likes" ? (
                <ul>
                  {(selectedPostLikesList || []).map((like, i) => (
                    <li key={i}>
                      <strong>{like.likeby}</strong> —{" "}
                      <span>{new Date(like.time).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  {(selectedPostCommentsList || []).map((comment, i) => (
                    <li key={i}>
                      <strong>{comment.commentBy}</strong> —{" "}
                      <span>{comment.text}</span>:{" "}
                      {new Date(comment.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => setShowPostDetails(false)}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ModalGenerator() {
    return (
      <>
        {
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-heading">
                  {modalType === "followers" ? "Followers" : "Following"}
                </h2>
                <button
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <ul className="modal-list">
                {modalList.map((user) => (
                  <li key={user.userid} className="modal-list-item">
                    <img src={user.image} alt="pfp" />
                    <div>
                      <strong>{user.username}</strong>
                      <p>{user.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      </>
    );
  }

  return (
    <div className="mainpage">
      <div className="navbar">
        <Navbar />
      </div>

      {loading ? (
        <div className="rightSide">Loading...</div>
      ) : user == null ? (
        <div className="rightSide">User not found</div>
      ) : showModal ? (
        requestModal()
      ) : (
        profileDetails()
      )}
    </div>
  );
}

export default UserInfoPage;
