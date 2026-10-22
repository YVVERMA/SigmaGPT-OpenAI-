import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import "./sidebar.css";

function Sidebar() {
  const {
    threads,
    activeThreadId,
    refreshThreads,
    startNewChat,
    openThread,
    deleteThread,
  } = useContext(MyContext);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Load chat history from the backend
  useEffect(() => {
    refreshThreads();
  }, [refreshThreads]);

  // Start a new chat
  const handleNewChat = () => {
    startNewChat();
    setMobileOpen(false);
  };

  // Open an existing chat
  const handleOpenChat = (threadId) => {
    openThread(threadId);
    setMobileOpen(false);
  };

  // Delete a chat
  const handleDeleteChat = async (event, threadId) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (confirmed) {
      await deleteThread(threadId);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar--open" : ""
        }`}
      >
        {/* Sidebar header */}
        <div className="sidebar-top">
          <div className="brand">
            <img
              src="/src/assets/blacklogo.png"
              alt="SigmaGPT logo"
              className="logo"
            />

            <span>
              Sigma<span className="brand-accent">GPT</span>
            </span>
          </div>

          <button
            className="icon-button sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* New chat */}
          <button
            className="new-chat-button"
            onClick={handleNewChat}
          >
            <i className="fa-solid fa-plus"></i>
            <span>New chat</span>
          </button>
        </div>

        {/* Chat history */}
        <div className="history-heading">
          RECENT CHATS
        </div>

        <ul className="history">
          {threads.length === 0 ? (
            <li className="history-empty">
              No conversations yet.
              <br />
              Start a new chat to begin!
            </li>
          ) : (
            threads.map((thread) => (
              <li
                key={thread.threadId}
                className={`history-item ${
                  activeThreadId === thread.threadId
                    ? "active"
                    : ""
                }`}
              >
                <button
                  className="history-open"
                  onClick={() =>
                    handleOpenChat(thread.threadId)
                  }
                  title={thread.title || "New chat"}
                >
                  <i className="fa-regular fa-message"></i>

                  <span>
                    {thread.title || "New chat"}
                  </span>
                </button>

                <button
                  className="history-delete"
                  onClick={(event) =>
                    handleDeleteChat(
                      event,
                      thread.threadId
                    )
                  }
                  aria-label="Delete conversation"
                  title="Delete chat"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="profile-avatar">Y</div>

          <div className="profile-copy">
            <strong>Yash Kumar Verma</strong>
            <span>Personal workspace</span>
          </div>

          <span
            className="online-dot"
            title="SigmaGPT"
          ></span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;