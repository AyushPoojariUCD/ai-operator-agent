# AI Browser Agent

A privacy-preserving AI assistant that automates tasks like ticket booking, form filling, and web scraping directly in your local browser using LLMs, Puppeteer/Selenium, and Electron.

## Overview

The AI Browser Agent is a locally run desktop application designed to help users automate complex web-based tasks through natural language commands. Unlike cloud-based assistants, it executes all actions directly on the user's device, ensuring that sensitive information such as passwords, personal data, and browsing activity never leave the local environment.

By integrating large language models (LLMs) with browser automation frameworks like Puppeteer or Selenium, the agent can understand user intents, analyze the content of multiple open browser tabs, and perform multi-step tasks autonomously. The use of Microsoft’s Semantic Kernel adds an extra layer of controlled, secure execution for each automation step.


## Features

- Chat interface for conversational task instructions
- End-to-end local execution; no data sent to cloud servers
- Automated task execution across browser tabs
- Browser content analysis using Puppeteer or Selenium
- Workflow planning using large language models (LLMs)
- Semantic Kernel integration for structured and secure task execution
- Built with React, Electron, Express, Firebase, and Puppeteer/Selenium

---

## Example Use Case

**User Command:**  
"Add two healthy snacks for my diet to my Tesco basket for next weekend."

**Agent Actions:**

1. Opens Tesco in the browser.
2. Searches for healthy snacks.
3. Selects suitable items based on dietary criteria.
4. Adds items to the cart.
5. Proceeds to checkout and schedules delivery.
6. Confirms task completion with the user.


---
## Project Workflow

![Project Workflow](https://github.com/AyushPoojariUCD/ai-operator-agent/blob/main/Project%20Workflow.png)


---

## 👩‍💻 Tech Stack

| Component            | Technology                                      |
|----------------------|--------------------------------------------------|
| UI                   | React, Electron, Tailwind CSS                   |
| Backend              | Python, Express (Node.js), Firebase Admin SDK           |
| Browser Automation   | Puppeteer, Selenium                             |
| Task Execution       | Microsoft Semantic Kernel                       |
| Planning             | OpenAI GPT (or local LLM alternatives)          |
| Deployment           | Docker, Kubernetes, Azure Cloud (App Service)   |

---

## 📂 Project Structure

```
ai-browser-agent/
│
├── backend/                                    # Backend
│ ├── routes/
│ ├── config/
│ └── index.js
│
├── frontend/                                   # Fronted: React + Electron
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── contexts/
│ │ └── App.jsx
│
├── electron/                                   # Electron entry point
│ └── main.mjs
│
├── k8s/                                        # Kubernetes manifests
│ ├── frontend-deployment.yaml
│ ├── backend-deployment.yaml
│
├── Dockerfile # Base Dockerfile for backend
├── Dockerfile.frontend                         # Dockerfile for frontend
├── .env                                        # Environment variables
└── README.md

```

## Installation

 **Clone the Repository**

```bash
git clone https://github.com/yourname/ai-browser-agent.git
cd ai-browser-agent
```

---

## Additional Resources
- [Project Plan](https://your-project-plan-link.com)
- [Documentation](https://your-video-link.com)  
- [Video Demonstration](https://your-video-link.com)  


## Team Members : `Coding Thumbs 👍`

- **Tarun Kumar**  
- **Ayush Poojari**
- **Deepak Shelke**
- **Sudhanshu Ghuge**    
- **Preet Raut** 
- **Soham Deo**
  
