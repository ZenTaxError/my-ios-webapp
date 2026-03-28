export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured for this site." },
      { status: 500 },
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = payload?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: "messages must be a non-empty array." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 800,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const message = data?.error?.message || "OpenAI request failed.";
      return Response.json({ error: message }, { status: upstream.status });
    }

    return Response.json({
      ...data,
      netlify: {
        siteId: context.site?.id,
        accountId: context.account?.id,
        deployPublished: context.deploy?.published,
      },
    });
  } catch (error) {
    console.error("Function execution failed", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
