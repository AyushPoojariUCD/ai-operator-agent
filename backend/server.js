require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { runMCP } = require("./mcp/index");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const { messages, mcpEnabled, html } = req.body;
  const userMessage = messages[messages.length - 1]?.content || "";

  console.log("📩 /api/chat received");
  console.log("   mcpEnabled =", mcpEnabled);
  console.log("   userMessage =", userMessage);
  console.log("   HTML length =", html?.length || 0);

  try {
    if (mcpEnabled) {
      // 1️⃣ Build & log the MCP prompt
      console.log("🧠 Running MCP on page HTML");
      const { buildPrompt } = require("./mcp/promptizer");
      const promptText = buildPrompt(userMessage, html);
      console.log("   Prompt excerpt:", promptText.slice(0, 200), "…");

      // 2️⃣ Invoke the MCP “brain”
      const actions = await runMCP(userMessage, html);
      console.log("   MCP returned actions:", JSON.stringify(actions, null, 2));

      // 3️⃣ Send back both a human-readable reply and the raw actions array
      const replyText = `🧠 MCP Action Plan:\n${JSON.stringify(actions, null, 2)}`;
      console.log("   Sending actions back to frontend:", actions);
      return res.json({ reply: replyText, actions });
    } else {
      // 4️⃣ Fallback to OpenAI chat completion
      console.log("💬 Running OpenAI chat fallback");
      const openaiMessages = messages.map((msg) =>
        msg.type === "user"
          ? { role: "user", content: msg.content }
          : { role: "assistant", content: msg.content }
      );
      console.log("   Messages to OpenAI:", openaiMessages);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",           // or "gpt-3.5-turbo"
          messages: openaiMessages,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      console.log("   OpenAI reply:", reply);
      return res.json({ reply });
    }
  } catch (err) {
    console.error("❌ Backend error in /api/chat:", err);
    return res.status(500).json({ reply: "❌ Internal server error." });
  }
});


app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
