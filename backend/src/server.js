import "dotenv/config";

import cors from "cors";
import express from "express";

import { HumanMessage } from "@langchain/core/messages";

import { helpdeskGraph } from "./graph.js";

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://nexa-ai-helpdesk.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Postman, curl aur server-to-server requests me origin nahi hota.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    message: "AI Helpdesk server is running",
  });
});

app.get("/health", (request, response) => {
  response.json({
    status: "healthy",
  });
});

app.post("/api/chat", async (request, response) => {
  try {
    const { message, threadId } = request.body;

    if (!message || !message.trim()) {
      return response.status(400).json({
        error: "Message is required.",
      });
    }

    if (!threadId) {
      return response.status(400).json({
        error: "Thread ID is required.",
      });
    }

    const result = await helpdeskGraph.invoke(
      {
        messages: [new HumanMessage(message.trim())],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      },
    );

    const lastMessage = result.messages[result.messages.length - 1];

    return response.json({
      reply:
        typeof lastMessage.content === "string"
          ? lastMessage.content
          : JSON.stringify(lastMessage.content),
    });
  } catch (error) {
    console.error("Chat error:", error);

    return response.status(500).json({
      error: "AI service is currently unavailable. Please try again.",
    });
  }
});

app.use((error, request, response, next) => {
  console.error("Server error:", error);

  if (error.message?.includes("CORS")) {
    return response.status(403).json({
      error: error.message,
    });
  }

  return response.status(500).json({
    error: "Something went wrong.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Helpdesk server running on port ${PORT}`);
});
