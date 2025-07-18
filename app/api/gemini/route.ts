import { initialMessage } from "@/lib/data";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Message, streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const runtime = "edge";

const generateId = () => Math.random().toString(36).slice(2, 15);

// Qodo Gen: Options | Test this function
export const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "user",
    content: initialMessage.content,
  },
  ...messages.map((message) => ({
    id: message.id || generateId(),
    role: message.role,
    content: message.content,
  })),
];

// Qodo Gen: Options | Test this function
export async function POST(request: Request) {
  const { messages } = await request.json();
  const stream = await streamText({
    model: google("gemini-pro"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 0.7,
  });

  return stream.toDataStreamResponse();
}
