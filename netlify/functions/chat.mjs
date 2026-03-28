export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = payload?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages array is required" }, { status: 400 });
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages,
        max_tokens: 800,
      }),
    });

    const raw = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "application/json";

    return new Response(raw, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch {
    return Response.json({ error: "Failed to reach upstream API" }, { status: 502 });
  }
};

export const config = {
  path: "/api/chat",
  method: "POST",
};
