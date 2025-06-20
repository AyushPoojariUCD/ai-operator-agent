function parseActions(response) {
    try {
      return JSON.parse(response); // LLM should return raw JSON array
    } catch (err) {
      console.error("Invalid JSON from LLM:", err.message);
      return [];
    }
  }
  
  module.exports = { parseActions };
  