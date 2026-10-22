import express from "express";
import Thread from "../models/Thread.js";

import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// Test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread",
    });

    const response = await thread.save();

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to save thread",
    });
  }
});


// Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({})
      .sort({ updatedAt: -1 });

    res.json(threads);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch",
    });
  }
});


// Get single thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.json(thread.messages);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to fetch chat",
    });
  }
});


// Delete thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
    });

    if (!deletedThread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.status(200).json({
      success: "Thread deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
});


// Chat with Gemini
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    // Create new thread
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    }

    // Existing thread
    else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }

    // Get Gemini response
    const assistantReply =
      await getOpenAIAPIResponse(message);

    // Save assistant response
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({
      reply: assistantReply,
    });

  } catch (error) {
    console.log("Chat Error:", error);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});


export default router;