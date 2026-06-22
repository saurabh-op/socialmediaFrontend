import "./openedChatPlaceholder.css";

function ChatPlaceholder() {
  return (
    <div className="cph_chat-window">
      <div className="cph_chat-header">
        <div className="cph_avatarWrapper"></div>

        <div className="cph_username"></div>
      </div>

      <div className="cph_chat-history">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className={`cph_message-row ${
              item % 2 === 0 ? "cph_me" : "cph_them"
            }`}
          >
            <div
              className={`cph_chat-message ${
                item % 2 === 0 ? "cph_my-message" : "cph_their-message"
              }`}
            ></div>
          </div>
        ))}
      </div>

      <div className="cph_chat-bottom">
        <div className="cph_chat-input-area">
          <div className="cph_input"></div>
          <div className="cph_send-btn"></div>
        </div>
      </div>
    </div>
  );
}

export default ChatPlaceholder;
