function buildPrompt(command, html) {
    return `
  You are an AI browser assistant. Based on the user command and the HTML of a web page,
  generate a list of actions to take on the page in valid JSON.
  
  User Command:
  "${command}"
  
  Page HTML (trimmed):
  ${html.slice(0, 5000)}
  
  Respond with:
  [
    { "action": "click", "selector": "#searchBtn" },
    { "action": "type", "selector": "#searchBox", "value": "apple" }
  ]
  `;
  }
  
  module.exports = { buildPrompt };

  