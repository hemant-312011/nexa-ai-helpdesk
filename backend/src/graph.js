import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";

import { ChatGroq } from "@langchain/groq";

import { SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  apiKey: process.env.GROQ_API_KEY,
});

const systemMessage = new SystemMessage(`
You are Nexa AI, a professional customer support assistant.

Your responsibilities:
- Help users with account problems.
- Help with password reset questions.
- Help with billing and payment issues.
- Help users track support tickets.
- Help with technical problems.
- Give clear and concise answers.
- Ask a follow-up question when information is missing.
- Never claim that an action was completed if you cannot actually perform it.
- Never ask users to share passwords, OTP codes or complete card information.
- Keep responses friendly and professional.
`);

async function supportNode(state) {
  const response = await model.invoke([systemMessage, ...state.messages]);

  return {
    messages: [response],
  };
}

const checkpointer = new MemorySaver();

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("supportNode", supportNode)
  .addEdge(START, "supportNode")
  .addEdge("supportNode", END);

export const helpdeskGraph = workflow.compile({
  checkpointer,
});
