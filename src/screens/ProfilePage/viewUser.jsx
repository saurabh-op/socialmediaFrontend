import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserInfoPage.css";

import "./layout_profile.css";
import "./post_popup.css";
import emptyProfilePic from "../../assets/no_profile_pic.png";
import Navbar from "../Layout/Navbar";
import axios from "axios";
import UserProfileSkeleton from "./profilePlaceholder";

import { Link } from "react-router-dom";
import EditProfile from "../edit profile/edit_profile";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { Circle, Heart, Settings, Share2 } from "lucide-react";
import { API_BASE_URL } from "../../config";
// Importing fonts :

function ViewUserPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [showUI, setShowUI] = useState(true);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [savedImageUrl, setSavedImageUrl] = useState(null);
  // Post details
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [selectedPostImageLink, setSelectedPostImageLink] = useState("");
  const [selectedPostTimestamp, setSelectedPostTimestamp] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostUsername, setSelectedPostUsername] = useState("");
  const [selectedPostCaption, setSelectedPostCaption] = useState("");
  const [selectedPostLikesCount, setSelectedPostLikesCount] = useState(0);
  const [selectedPostLikesList, setSelectedPostLikesList] = useState([]);

  // Editprofile page
  const navigate = useNavigate();

  const [view, setView] = useState("comments");
  const isMobile = useIsMobile();

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
        console.log("Fetched user is:", userData);

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
              </div>
            </div>
          </div>
          {/*Stats*/}
          <div className="stats-grid">
            <div className="stat-card">
              <strong>{formatNumber(user.posts)}</strong>
              <span>Posts</span>
            </div>

            <div className="stat-card clickables">
              <strong>{formatNumber(user.followers)}</strong>
              <span>Followers</span>
            </div>

            <div className="stat-card clickables">
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

            <div className="stat-box">
              <strong>{formatNumber(user.followers)}</strong>
              <span>followers</span>
            </div>

            <div className="stat-box">
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
        fetch(`${API_BASE_URL}/like/likeCount/${post.postId}`),
        // fetch(
        //   `${API_BASE_URL}/comment/commentDetails/${post.postId}`
        // ),
      ]);

      const likeData = await likeRes.json();
      // const commentData = await commentRes.json();

      setSelectedPostLikesCount(likeData.likeCount);
      //setSelectedPostLikesList(likeData.likelist || []);

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

  return (
    <div className="profilemainpage">
      <Navbar />

      {loading ? (
        <UserProfileSkeleton />
      ) : user == null ? (
        <div className="rightSide_profile">User not found</div>
      ) : (
        profileDetails()
      )}
    </div>
  );
}

export default ViewUserPage;
