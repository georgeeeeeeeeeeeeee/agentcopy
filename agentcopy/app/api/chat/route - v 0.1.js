import Anthropic from "@anthropic-ai/sdk";
import { getPrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase-server";

export async function POST(request) {
  // Verify user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, workflowId } = await request.json();

  if (!workflowId || !messages?.length) {
    return new Response("Missing workflowId or messages", { status: 400 });
  }

  const systemPrompt = getPrompt(workflowId);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Stream the response
  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Convert to a ReadableStream for the frontend
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
