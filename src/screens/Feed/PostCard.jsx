import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./PostCard.css";
import { Heart, MoreHorizontal } from "lucide-react";
import userLogo from "../../assets/man.jpg"; // Replace with actual user logo URL

function PostCard({ post }) {
  //const [showComments, setDisplayComments] = useState(false);
  //const [isCommentLoading, setisCommentLoading] = useState(false);
  //const [comment, setComment] = useState("");
  //const [commentsList, setCommentsList] = useState([]);
  const [liked, setLike] = useState(false);
  const [caption_expanded, setExpanded] = useState(false);
  const [like_count, setLikeCount] = useState(0);
  const userId = localStorage.getItem("userId");
  const [ownerImage, setOwnerImage] = useState(userLogo);
  const navigate = useNavigate();

  const goToProfile = (e) => {
    e?.stopPropagation();
    navigate(`/viewuser/${post.owner}`);
  };

  useEffect(() => {
    let cancelled = false;

    const loadOwnerImage = async () => {
      try {
        // // if the post already includes a profile image url, use it
        // if (post?.profileImageUrl) {
        //   setOwnerImage(post.profileImageUrl);
        //   return;
        // }

        // if (!ownerId) return;

        const res = await fetch(
          `http://localhost:8080/api/editUser/${post.owner}/profilePic`,
        );

        if (!res.ok) return;

        const url = await res.text();
        if (!cancelled && url) setOwnerImage(url);
      } catch (err) {
        console.error("Error fetching owner profile pic:", err);
      }
    };

    loadOwnerImage();

    return () => {
      cancelled = true;
    };
  }, [post]);

  useEffect(() => {
    fetchLikeCount();
  }, []);

  const fetchLikeCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/like/likeCount/${post.postId}`,
      );

      if (response.ok) {
        const count = await response.json();
        setLikeCount(count);
      }
    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  };
  useEffect(() => {
    fetchLikeCount();
    fetchLikeStatus();
  }, []);
  const fetchLikeStatus = async () => {
    const response = await fetch(
      `http://localhost:8080/api/like/isLiked/${post.postId}/${userId}`,
    );

    if (response.ok) {
      const status = await response.json();
      setLike(status);
    }
  };

  const toggleCaption = () => {
    setExpanded(!caption_expanded);
  };
  // useEffect(() => {
  //   const textarea = document.querySelector(".comment-textarea");
  //   if (textarea) {
  //     textarea.style.height = "auto";
  //     textarea.style.height = textarea.scrollHeight + "px";
  //   }
  // }, [comment]);

  // const LoadComments = async () => {
  //   setDisplayComments(true);
  //   setisCommentLoading(true);
  //   try {
  //     // const response = await fetch(`/api/posts/${post.id}/comments`);
  //     // const data = await res  ponse.json();
  //     setCommentsList([]);
  //   } catch (err) {
  //     console.error("Failed to fetch comments:", err);
  //   } finally {
  //     setisCommentLoading(false);
  //   }
  // };
  // const handleClose = () => {
  //   setDisplayComments(false);
  // };

  // const handleCommentSubmit = () => {
  //   if (comment.trim() === "") return;
  //   setCommentsList((prev) => [...prev, comment]);
  //   setComment("");
  // };
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now - time) / 1000);

    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} year`;
  };

  const handle_like = async () => {
    try {
      if (!liked) {
        const response = await fetch(
          `http://localhost:8080/api/like/${userId}/addLike/${post.postId}`,
          {
            method: "POST",
          },
        );

        if (response.ok) {
          setLike(true);
          setLikeCount((prev) => prev + 1);
        }
      } else {
        const response = await fetch(
          `http://localhost:8080/api/like/removeLike/${post.postId}/${userId}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          setLike(false);
          setLikeCount((prev) => Math.max(prev - 1, 0));
        }
      }
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };
  return (
    <div className="post-card">
      <div className="post-top">
        <div className="post-user">
          <img
            src={ownerImage || userLogo}
            alt="User"
            className="user-logo"
            onClick={goToProfile}
            style={{ cursor: "pointer" }}
          />

          <div className="user-meta">
            <span
              className="user-name"
              onClick={goToProfile}
              style={{ cursor: "pointer" }}
            >
              {post.name}
            </span>{" "}
            <span
              className="user-handle"
              onClick={goToProfile}
              style={{ cursor: "pointer" }}
            >
              @{post.name}
            </span>
          </div>
        </div>
        <span className="post-timestamp">{getTimeAgo(post.timestamp)}</span>
      </div>
      <div className="post-middle">
        <img src={post.imageUrl} alt="Post" className="post-image" />
      </div>
      <div className="post-bottom">
        <div
          onClick={toggleCaption}
          style={{ userSelect: "none" }}
          className={`post-caption ${caption_expanded ? "expanded" : ""}`}
        >
          {post.caption}{" "}
        </div>
        <div>
          {" "}
          <button
            className={`like-btn ${liked ? "liked" : ""}`}
            onClick={() => handle_like()}
          >
            {liked ? "❤️" : "🤍"}
          </button>{" "}
          <span className="like-count">
            {like_count} {like_count === 1 ? "like" : "likes"}
          </span>
        </div>
      </div>
      {/* {showComments && (
        <div className="comment-section">
          {isCommentLoading ? (
            <div className="loading-text">Loading comments...</div>
          ) : (
            <>
              <textarea
                className="comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button
                className="submit-comment-btn"
                onClick={handleCommentSubmit}
              >
                Submit
              </button>

              <div className="comment-list">
                {commentsList.length === 0 ? (
                  <div className="no-comments">No comments yet</div>
                ) : (
                  commentsList.map((cmt, index) => (
                    <div key={index} className="comment-item">
                      {cmt}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )} */}
    </div>
  );
}

export default PostCard;
