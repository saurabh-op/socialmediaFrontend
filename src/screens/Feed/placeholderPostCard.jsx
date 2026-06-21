import "./placeholderPostCard.css";

function PlaceholderPostCard() {
  return (
    <div className="ph_post-card">
      <div className="ph_post-top ">
        <div className="ph_post-user">
          <div className="ph_user-logo" />

          <div className="ph_user-meta">
            <div className="ph_user-name"></div>
            <div className="ph_user-handle"></div>
          </div>
        </div>
      </div>
      <div className="ph_post-middle"></div>
      <div className="ph_post-bottom"></div>
    </div>
  );
}

export default PlaceholderPostCard;
