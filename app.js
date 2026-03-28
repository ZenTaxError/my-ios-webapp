const chatEl = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");

let history = [{ role: "system", content: "You are a helpful assistant." }];

function appendMessage(role, text){
  const el = document.createElement("div");
  el.className = "msg " + role;
  el.textContent = text;
  chatEl.appendChild(el);
  chatEl.scrollTop = chatEl.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendMessage("user", text);
  input.value = "";
  history.push({ role: "user", content: text });

  appendMessage("assistant", "…"); // placeholder
  const placeholder = chatEl.lastElementChild;

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "API request failed");
    }
    const reply = data.choices?.[0]?.message?.content || "No response";
    placeholder.textContent = reply;
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    placeholder.textContent = err.message || "Error contacting API";
    console.error(err);
  }
});
