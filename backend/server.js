require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { runMCP } = require('./mcp/index'); // Your MCP logic

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    const { messages, mcpEnabled } = req.body;
    const userMessage = messages[messages.length - 1]?.content ?? '';
  
    try {
      let reply;
  
      if (mcpEnabled) {
        const fakeHTML = "<html><body><button id='book'>Book Now</button></body></html>";
        const actions = await runMCP(userMessage, fakeHTML);
        reply = `🧠 MCP Action Plan: ${JSON.stringify(actions, null, 2)}`;
      } else {
        // 🧠 OpenAI Chat Completion
        const openaiMessages = messages.map((msg) =>
          msg.type === "user"
            ? { role: "user", content: msg.content }
            : { role: "assistant", content: msg.content }
        );
  
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4", // or "gpt-3.5-turbo"
            messages: openaiMessages,
            temperature: 0.7,
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        reply = response.data.choices[0].message.content;
      }
  
      res.json({ reply });
    } catch (err) {
      console.error("❌ Backend error:", err);
      res.status(500).json({ reply: "❌ Internal server error." });
    }
  });
  

app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
