import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";

const suggestions = [
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Learn something",
    prompt:
      "Explain a difficult topic in simple terms with an example.",
  },
  {
    icon: "fa-solid fa-code",
    title: "Write code",
    prompt:
      "Help me write clean, well-commented code for a beginner.",
  },
  {
    icon: "fa-solid fa-lightbulb",
    title: "Get ideas",
    prompt:
      "Give me five creative ideas for a useful student project.",
  },
  {
    icon: "fa-solid fa-pen",
    title: "Improve writing",
    prompt:
      "Help me write a clear, professional message.",
  },
];

function ChatWindow() {
  const {
    messages,
    loading,
    error,
    sendMessage,
    setError,
  } = useContext(MyContext);

  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Automatically resize the input
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      textarea.style.height =
        `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Send a message
  const handleSubmit = async (event) => {
    event?.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(message);

    textareaRef.current?.focus();
  };

  // Enter sends; Shift + Enter creates a new line
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="chat-window">
      {/* Header */}
      <header className="chat-header">
        <div className="header-brand">
          SigmaGPT
          <i className="fa-solid fa-chevron-down"></i>
        </div>

        <div className="header-status">
          <span></span>
          Gemini-powered assistant
        </div>
      </header>

      {/* Conversation area */}
      <section
        className={`conversation ${
          messages.length === 0
            ? "conversation--empty"
            : ""
        }`}
      >
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-mark">
              <i className="fa-solid fa-sparkles"></i>
            </div>

            <h1>What can I help you with?</h1>

            <p>
              Ask a question, explore an idea, or get help
              with your next project.
            </p>

            {/* Suggested prompts */}
            <div className="suggestion-grid">
              {suggestions.map((item) => (
                <button
                  className="suggestion-card"
                  key={item.title}
                  onClick={() => setInput(item.prompt)}
                >
                  <span className="suggestion-icon">
                    <i className={item.icon}></i>
                  </span>

                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.prompt}</small>
                  </span>

                  <i className="fa-solid fa-arrow-up-right-from-square suggestion-arrow"></i>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <Chat
                key={
                  `${message.timestamp || "message"}-${index}`
                }
                role={message.role}
                content={message.content}
              />
            ))}

            {/* AI loading indicator */}
            {loading && (
              <Chat
                role="assistant"
                isPending={true}
              />
            )}

            <div ref={bottomRef}></div>
          </div>
        )}
      </section>

      {/* Error message */}
      {error && (
        <div className="error-banner" role="alert">
          <i className="fa-solid fa-circle-exclamation"></i>

          <span>{error}</span>

          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Message input */}
      <footer className="composer-area">
        <form
          className="composer"
          onSubmit={handleSubmit}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Message SigmaGPT..."
            rows={1}
            aria-label="Message SigmaGPT"
          />

          <button
            className="send-button"
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-arrow-up"></i>
            )}
          </button>
        </form>

        <div className="composer-hint">
          <span>
            AI can make mistakes. Verify important information.
          </span>

          <span>
            Enter to send · Shift + Enter for a new line
          </span>
        </div>
      </footer>
    </main>
  );
}

export default ChatWindow;