import "./chatListPlaceholder.css";

function ChatListSkeleton() {
  return (
    <div className="clph_chatListContainer">
      <div className="clph_searchBar"></div>
      <div className="clph_chat_list">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="clph_chatCard">
            <div className="clph_avatar"></div>

            <div className="clph_username"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatListSkeleton;
