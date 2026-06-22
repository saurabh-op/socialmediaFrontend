import "./profilePlaceholder.css";

function UserProfileSkeleton() {
  return (
    <div className="uph_container">
      <section className="uph_profileCard">
        <div className="uph_profileDetails">
          {/* Avatar */}
          <div className="uph_avatarWrapper"></div>

          {/* User Info */}
          <div className="uph_profileContent">
            <div className="uph_name"></div>
            <div className="uph_handle"></div>
            <div className="uph_handle"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="uph_statsGrid">
          <div className="uph_statCard"></div>
          <div className="uph_statCard"></div>
          <div className="uph_statCard"></div>
        </div>
      </section>

      {/* Gallery */}
      <div className="uph_galleryGrid">
        <div className="uph_galleryItem"></div>
        <div className="uph_galleryItem"></div>
        <div className="uph_galleryItem"></div>
      </div>
    </div>
  );
}

export default UserProfileSkeleton;
