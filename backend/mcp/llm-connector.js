require('dotenv').config();
const axios = require('axios');

async function callLLM(prompt) {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful web automation planner." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("LLM API Error:", err.message);
    return "[]";
  }
}

module.exports = { callLLM };
