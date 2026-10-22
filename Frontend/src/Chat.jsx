import "./Chat.css";

function Chat({ role, content, isPending = false }) {
  const isUser = role === "user";

  return (
    <article
      className={`message-row ${
        isUser
          ? "message-row--user"
          : "message-row--assistant"
      }`}
    >
      {/* Avatar */}
      <div
        className={`message-avatar ${
          isUser
            ? "message-avatar--user"
            : "message-avatar--assistant"
        }`}
      >
        {isUser ? (
          "Y"
        ) : (
          <i className="fa-solid fa-sparkles"></i>
        )}
      </div>

      {/* Message content */}
      <div className="message-body">
        <div className="message-author">
          {isUser ? "You" : "SigmaGPT"}
        </div>

        {isPending ? (
          <div
            className="typing-indicator"
            aria-label="SigmaGPT is thinking"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="message-content">
            {content}
          </div>
        )}
      </div>
    </article>
  );
}

export default Chat;