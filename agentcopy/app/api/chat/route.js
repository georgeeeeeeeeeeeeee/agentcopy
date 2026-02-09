import Anthropic from "@anthropic-ai/sdk";
import { getPrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase-server";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if user has credits BEFORE processing
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits <= 0) {
    return new Response(
      JSON.stringify({
        error: "NO_CREDITS",
        message: "You have no credits remaining. Please purchase more to continue.",
      }),
      {
        status: 402,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { messages, workflowId } = await request.json();

  if (!workflowId || !messages?.length) {
    return new Response("Missing workflowId or messages", { status: 400 });
  }

  const systemPrompt = getPrompt(workflowId);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Deduct credit BEFORE making the API call
  const { error: deductError } = await supabase.rpc("deduct_credit", {
    user_id: user.id,
  });

  if (deductError) {
    console.error("Failed to deduct credit:", deductError);
    return new Response("Failed to process request", { status: 500 });
  }

  // Get updated credit count to send back
  const { data: updatedProfile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const remainingCredits = updatedProfile?.credits ?? 0;

  // Use the raw streaming API (async iterator — no event duplication)
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: systemPrompt,
    stream: true,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      // Send credits update first
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ credits: remainingCredits })}\n\n`)
      );

      try {
        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
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