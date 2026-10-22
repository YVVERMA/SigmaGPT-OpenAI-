```jsx
import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

export const MyContext = createContext(null);

// Backend URL configuration
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export const API_BASE = BACKEND_URL
  ? `${BACKEND_URL.replace(/\/+$/, "")}/api`
  : "http://localhost:8080/api";

export function MyContextProvider({ children }) {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all conversations
  const refreshThreads = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/thread`);

      if (!response.ok) {
        throw new Error("Failed to load chat history.");
      }

      const data = await response.json();
      setThreads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Cannot connect to the backend server."
      );
    }
  }, []);

  // Start a new conversation
  const startNewChat = useCallback(() => {
    setActiveThreadId(null);
    setMessages([]);
    setError("");
  }, []);

  // Open an existing conversation
  const openThread = useCallback(async (threadId) => {
    setActiveThreadId(threadId);
    setMessages([]);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/thread/${encodeURIComponent(threadId)}`
      );

      if (!response.ok) {
        throw new Error("Failed to open conversation.");
      }

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Unable to load this conversation."
      );
    }
  }, []);

  // Send a message to the AI
  const sendMessage = useCallback(
    async (text) => {
      const content = text.trim();

      if (!content || loading) {
        return;
      }

      setError("");

      const threadId =
        activeThreadId ||
        `thread-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`;

      setActiveThreadId(threadId);

      setMessages((current) => [
        ...current,
        {
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        },
      ]);

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId,
            message: content,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to get an AI response."
          );
        }

        if (!data.reply) {
          throw new Error("The AI returned an empty response.");
        }

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString(),
          },
        ]);

        await refreshThreads();
      } catch (err) {
        setError(
          err.message ||
            "Unable to connect to SigmaGPT. Check your backend."
        );
      } finally {
        setLoading(false);
      }
    },
    [activeThreadId, loading, refreshThreads]
  );

  // Delete a conversation
  const deleteThread = useCallback(
    async (threadId) => {
      setError("");

      try {
        const response = await fetch(
          `${API_BASE}/thread/${encodeURIComponent(threadId)}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to delete conversation."
          );
        }

        setThreads((current) =>
          current.filter(
            (thread) => thread.threadId !== threadId
          )
        );

        if (activeThreadId === threadId) {
          startNewChat();
        }
      } catch (err) {
        setError(
          err.message || "Unable to delete this conversation."
        );
      }
    },
    [activeThreadId, startNewChat]
  );

  // Context value
  const value = useMemo(
    () => ({
      threads,
      activeThreadId,
      messages,
      loading,
      error,
      refreshThreads,
      startNewChat,
      openThread,
      sendMessage,
      deleteThread,
      setError,
    }),
    [
      threads,
      activeThreadId,
      messages,
      loading,
      error,
      refreshThreads,
      startNewChat,
      openThread,
      sendMessage,
      deleteThread,
    ]
  );

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}
```0
