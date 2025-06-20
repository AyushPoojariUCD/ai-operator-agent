const { buildPrompt } = require('./promptizer');
const { callLLM } = require('./llm-connector');
const { parseActions } = require('./action-parser');

async function runMCP(userCommand, pageHTML) {
  const prompt = buildPrompt(userCommand, pageHTML);
  const llmResponse = await callLLM(prompt);
  const actions = parseActions(llmResponse);
  return actions;
}

module.exports = { runMCP };
