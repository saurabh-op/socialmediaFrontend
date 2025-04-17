import React, { useState, useEffect } from "react";

import post from "../../../assets/post.png";
import "./PostCard.css";

function PostCard() {
  const [showComments, setDisplayComments] = useState(false);
  const [isCommentLoading, setisCommentLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [liked, setLike] = useState(false);

  const LoadComments = async () => {
    setDisplayComments(true);
    setisCommentLoading(true);
    try {
      // const response = await fetch(`/api/posts/${post.id}/comments`);
      // const data = await response.json();
      setCommentsList([]);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setisCommentLoading(false);
    }
  };
  const handleClose = () => {
    setDisplayComments(false);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() === "") return;
    setCommentsList((prev) => [...prev, comment]);
    setComment("");
  };
  return (
    <div className="post-card">
      {/* Top: User Info */}
      <div className="post-top">
        <img src={post.userLogo} alt="User" className="user-logo" />
        <span className="user-name">username</span>
      </div>
      {/* Middle: Post Image */}
      <div className="post-middle">
        <img src={post} alt="Post" className="post-image" />
      </div>
      {/* Bottom: Actions */}
      <div className="post-bottom">
        <button className="action-btn" onClick={() => setLike(!liked)}>
          {liked ? "❤️" : "🤍"}
        </button>

        <button
          className="action-btn"
          onClick={showComments ? handleClose : LoadComments}
        >
          {showComments ? "Close" : "💬 Comment"}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
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
      )}
    </div>
  );
}

export default PostCard;
