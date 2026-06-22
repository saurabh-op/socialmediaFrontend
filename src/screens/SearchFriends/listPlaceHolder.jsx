import "./listPlaceHolder.css";

const SearchListPlaceHolder = () => {
  return (
    <div className="sf_resultlist">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="sf_srchlistItem" key={index}>
          <div className="sf_pic_and_name">
            <div className="sf_picture"></div>

            <div className="sf_srch-user-info">
              <div className="sf_username"></div>
              <div className="sf_name"></div>
            </div>
          </div>

          <div>
            <div className="sf_friend-btn"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchListPlaceHolder;
