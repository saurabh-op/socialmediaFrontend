{
  /* Right - Info */
}
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
            <strong>{comment.commentBy}</strong> — <span>{comment.text}</span>:{" "}
            {new Date(comment.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    )}
  </div>

  <button onClick={() => setShowPostDetails(false)} className="close-button">
    Close
  </button>
</div>;
