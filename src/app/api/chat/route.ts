import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { OramaManager } from "@/lib/orama";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

// export const runtime = "edge";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, accountId } = await req.json();
    const oramaManager = new OramaManager(accountId);
    await oramaManager.initialize();

    const lastMessage = messages[messages.length - 1];

    const context = await oramaManager.vectorSearch({
      prompt:
        lastMessage?.parts
          ?.filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join(" ") ?? ("" as string),
    });
    console.log(context.hits.length + " hits found");
    // console.log(context.hits.map((hit) => hit.document));

    const prompt = `You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails.
            THE TIME NOW IS ${new Date().toLocaleString()}
      
      START CONTEXT BLOCK
      ${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
      END OF CONTEXT BLOCK
      
      When responding, please keep in mind:
      - Be helpful, clever, and articulate.
      - Rely on the provided email context to inform your responses.
      - If the context does not contain enough information to answer a question, politely say you don't have enough information.
      - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
      - Do not invent or speculate about anything that is not directly supported by the email context.
      - Keep your responses concise and relevant to the user's questions or the email being composed.`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: prompt,
      messages: convertToModelMessages(messages),
      onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
        const today = new Date().toDateString();
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
