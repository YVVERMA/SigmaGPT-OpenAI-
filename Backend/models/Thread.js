import mongoose, { connect } from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    email: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  messages: [MessagesSchema],
  createAt: {
    type: Date,
    defauult: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("Thread",ThreadSchema)