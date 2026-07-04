import express from "express";
import Thread from "../models/Thread.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  const thread = new Thread({
    threadId: "xyz",
    title: "Testing New Thread",
  });

  const response = await thread.save();
  res.send(response);
});

export default router;
