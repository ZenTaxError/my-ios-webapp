import fetch from "node-fetch";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!messages) return { statusCode: 400, body: "messages required" };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change if you prefer gpt-4o, gpt-4o-mini, or gpt-3.5-turbo
        messages,
        max_tokens: 800,
      }),
    });

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
