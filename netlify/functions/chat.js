import OpenAI from "openai";

const openai = new OpenAI();

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages,
      max_completion_tokens: 800,
    });

    return Response.json(completion);
  } catch (err) {
    const upstreamStatus = err?.status;
    const upstreamMessage = err?.error?.message || err?.message;

    if (typeof upstreamStatus === "number") {
      return Response.json(
        { error: upstreamMessage || "Upstream API error" },
        { status: upstreamStatus },
      );
    }

    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
