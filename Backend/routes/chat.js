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
    res.send(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to save thread" });
  }
});

// Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); // descending order

    res.json(threads); // ✅ IMPORTANT
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Faild to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Falied to delete thread" });
  }
});
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields",
        });
    }

    try {
        let thread = await Thread.findOne({ threadId });

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
        } else {
            thread.messages.push({
                role: "user",
                content: message,
            });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

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
        console.log(error);
 
        res.status(500).json({
            error: "Internal Server Error",
        });
    } 
});  
 
export default router;
