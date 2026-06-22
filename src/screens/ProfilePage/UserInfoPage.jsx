import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserInfoPage.css";

import "./Modal.css";
import "./layout_profile.css";
import "./post_popup.css";
import UserProfileSkeleton from "./profilePlaceholder";
import emptyProfilePic from "../../assets/no_profile_pic.png";
import Navbar from "../Layout/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import EditProfile from "../edit profile/edit_profile";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { Circle, CircleX, Heart, Settings, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

function UserInfoPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [showUI, setShowUI] = useState(true);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "followers" or "following"
  const [modalList, setModalList] = useState([]);
  const [savedImageUrl, setSavedImageUrl] = useState(null);
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

  // Editprofile page
  const navigate = useNavigate();

  const [view, setView] = useState("comments");
  const isMobile = useIsMobile();
  const fetchRequests = async () => {
    try {
      console.log("fetching requests ");
      const id = localStorage.getItem("userid");
      const res = await fetch(`${API_BASE_URL}/request/${id}`);

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
    name: "Something went wrong",
    username: "somethingwentwrong",
    bio: "somethingwentwrogn",
    posts: 0,
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        // Fetch basic user info
        const userRes = await fetch(`${API_BASE_URL}/users/get/${userId}`);
        const userData = await userRes.json();
        // console.log("Fetched user is:", userData);

        if (userData != null) {
          setUser((prevUser) => ({
            ...prevUser,
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
          }));
        }
        if (userData.profileImageUrl) {
          const imageRes = await fetch(
            `${API_BASE_URL}/editUser/${userId}/profilePic`,
          );
          if (imageRes.ok) {
            const imageUrl = await imageRes.text();
            setSavedImageUrl(imageUrl);
          }
        }
        localStorage.setItem("user-profile-pic", userData.profileImageUrl);
        console.log("profile detilas:", userData);
        // Parallel fetches for counts
        const [followersRes, followingRes, postsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/follower/count/${userId}`),
          fetch(`${API_BASE_URL}/following/count/${userId}`),
          fetch(`${API_BASE_URL}/posts/count/${userId}`),
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

  const formatNumber = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    return num.toString();
  };
  function useIsMobile(maxWidth = 600) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= maxWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [maxWidth]);

    return isMobile;
  }
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/posts/allPosts/${userId}`);
        setPosts(res.data.gallery);
        console.log(res.data.gallery);
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
        `${API_BASE_URL}/request/accept/${receiverId}/${senderId}`,
      );
      console.log("Request accepted:", response.data);

      setRequests((prev) => prev.filter((req) => req.senderid !== senderId));

      toast.success("Accepted!");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  const deleteRequest = async (senderId) => {
    const receiverId = localStorage.getItem("userid");
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/request/delete/${receiverId}/${senderId}`,
      );
      console.log("Request accepted:", response.data);

      setRequests((prev) => prev.filter((req) => req.senderid !== senderId));

      toast.error("Rejected");
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
        ? `${API_BASE_URL}/follower/${userId}`
        : `${API_BASE_URL}/following/${userId}`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) =>
        setModalList(
          modalType === "followers"
            ? data.followersList || []
            : data.followingList || [],
        ),
      )
      .catch((err) => console.error(`Error fetching ${modalType}:`, err));
  }, [isModalOpen]);

  function requestModal() {
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-heading">Friend Requests </div>
            <button
              className="modal_close-btn"
              onClick={() => setShowModal(false)}
            >
              <CircleX />
            </button>
          </div>
          <div className="modal-list">
            {requests.length == 0
              ? "No New requests "
              : requests.map((req) => (
                  <div className="modal-list-item" key={req.senderid ?? "NA"}>
                    <div className="rqst-user-info">
                      {" "}
                      <img
                        src={
                          req.senderimage?.trim()
                            ? req.senderimage
                            : emptyProfilePic
                        }
                        alt="pfp"
                        onError={(e) => {
                          e.target.src = emptyProfilePic;
                        }}
                      />
                      <div>
                        <p>{req.sendername}</p>
                        <div className="modal_username">
                          @ {req.senderusername}
                        </div>
                      </div>
                    </div>

                    <div className="rqst-action-buttons">
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
          </div>
        </div>
      </div>
    );
  }

  function profileDetails() {
    return (
      <div className="profile-container">
        <section className="profile-card">
          <div className="profile-details">
            {/* Avatar */}
            <div className="avatar-wrapper">
              <div className="avatar-gradient">
                <img
                  className="avatar-img"
                  src={savedImageUrl || emptyProfilePic}
                  alt="Profile"
                />
              </div>

              <span className="online-indicator"></span>
            </div>

            {/* INFO */}
            <div className="profile-content">
              <div className="profile-top">
                <div>
                  <div className="name-row">
                    <h1>{user.name}</h1>
                  </div>

                  <p className="handle">@{user.username}</p>
                </div>
                {/* BIO */}
                <div className="bio">
                  <p>{user.bio}</p>
                </div>
                <div className="profile-actions">
                  <button
                    className="glass-btn primary-btn"
                    onClick={fetchRequests}
                  >
                    Requests
                  </button>

                  <button
                    className="icon-btn"
                    onClick={() => navigate("/edit-profile")}
                  >
                    <FiEdit2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*Stats*/}
          <div className="stats-grid">
            <div className="stat-card">
              <strong>{formatNumber(user.posts)}</strong>
              <span>Posts</span>
            </div>

            <div
              className="stat-card clickables"
              onClick={() => openModal("followers")}
            >
              <strong>{formatNumber(user.followers)}</strong>
              <span>Followers</span>
            </div>

            <div
              className="stat-card clickables"
              onClick={() => openModal("following")}
            >
              <strong>{formatNumber(user.following)}</strong>
              <span>Following</span>
            </div>
          </div>
        </section>

        {isMobile && (
          <div className="stats_for_mobile_view">
            <div className="stat-box">
              <strong>{formatNumber(user.posts)}</strong>
              <span>posts</span>
            </div>

            <div className="stat-box" onClick={() => openModal("followers")}>
              <strong>{formatNumber(user.followers)}</strong>
              <span>followers</span>
            </div>

            <div className="stat-box" onClick={() => openModal("following")}>
              <strong>{formatNumber(user.following)}</strong>
              <span>following</span>
            </div>
          </div>
        )}

        {/* GALLERY */}
        <div className="gallery-grid">
          {posts?.map((post) => (
            <div
              key={post.postId}
              className="gallery-item"
              onClick={() => handlePostClick(post)}
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="gallery-image"
              />
            </div>
          ))}
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
    setSelectedPostUsername(post.username);

    try {
      const [likeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/like/likeDetails/${post.postId}`),
        // fetch(
        //   `${API_BASE_URL}/comment/commentDetails/${post.postId}`
        // ),
      ]);

      const likeData = await likeRes.json();
      // const commentData = await commentRes.json();

      setSelectedPostLikesCount(likeData.likeCount);
      setSelectedPostLikesList(likeData.likelist || []);

      //     setSelectedPostCommentsCount(commentData.commentCount);
      //    setSelectedPostCommentsList(commentData.commentList || []);
    } catch (err) {
      // console.error("Error fetching like/comment details:", err);
    }
  }

  function PostDetails() {
    return (
      <div
        className="post-overlay-background"
        onClick={() => setShowPostDetails(false)}
      >
        <div
          className="post-details-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="imgcontainer">
            {/* IMAGE */}
            <img
              src={selectedPostImageLink}
              alt="post"
              onClick={() => setShowUI((prev) => !prev)}
            />
          </div>

          {/* BOTTOM OVERLAY */}
          <div
            className={`post-bottom-overlay ${
              showUI ? "overlay-visible" : "overlay-hidden"
            }`}
          >
            <div className="post-user-info">
              <div className="overlay-username">@{selectedPostUsername}</div>

              <div className="post-user-meta">
                <div className="overlay-time">
                  {new Date(selectedPostTimestamp).toLocaleString([], {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }) +
                    " · " +
                    new Date(selectedPostTimestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                </div>

                <div className="overlay-likes">
                  <Circle size={8} fill="white" strokeWidth={2} />
                  <div>Likes {selectedPostLikesCount}</div>
                </div>
              </div>
            </div>
            <div className="overlay-caption">{selectedPostCaption}</div>
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
                  className="modal_close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  <CircleX />
                </button>
              </div>
              <ul className="modal-list">
                {modalList.map((user) => (
                  <li key={user.userid} className="modal-list-item">
                    <img
                      src={user.image?.trim() ? user.image : emptyProfilePic}
                      alt="pfp"
                      onError={(e) => {
                        e.target.src = emptyProfilePic;
                      }}
                    />
                    <div>
                      <p>{user.name}</p>
                      <div className="modal_username">@ {user.username}</div>
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
    <div className="profilemainpage">
      <Navbar />

      {loading ? (
        <UserProfileSkeleton />
      ) : user == null ? (
        <div className="rightSide_profile">User not found</div>
      ) : showModal ? (
        requestModal()
      ) : (
        profileDetails()
      )}
    </div>
  );
}

export default UserInfoPage;
