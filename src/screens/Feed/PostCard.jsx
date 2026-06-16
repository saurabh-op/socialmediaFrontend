import React, { useState, useEffect } from "react";

import "./PostCard.css";
import { Heart, MoreHorizontal } from "lucide-react";
import userLogo from "../../assets/man.jpg"; // Replace with actual user logo URL

function PostCard({ post }) {
  const [showComments, setDisplayComments] = useState(false);
  const [isCommentLoading, setisCommentLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [liked, setLike] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleCaption = () => {
    setExpanded(!expanded);
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
  //     // const data = await response.json();
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

  return (
    <div className="post-card">
      <div className="post-top">
        <div className="post-user">
          <img src={userLogo} alt="User" className="user-logo" />

          <div className="user-meta">
            <span className="user-name">{post.name}</span>

            <span className="post-timestamp">
              @{post.owner} · {getTimeAgo(post.timestamp)}
            </span>
          </div>
        </div>

        <button className="more-btn">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="post-middle">
        <img src={post.imageUrl} alt="Post" className="post-image" />
      </div>
      <div className="post-bottom">
        <div
          onClick={toggleCaption}
          style={{ userSelect: "none" }}
          className={`post-caption ${expanded ? "expanded" : ""}`}
        >
          {post.caption}{" "}
        </div>
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={() => setLike(!liked)}
        >
          {liked ? "❤️" : "🤍"}
        </button>
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
