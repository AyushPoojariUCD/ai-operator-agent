import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow, agentWindow;
const isDev = !app.isPackaged;

function createMainWindow() {
  console.log("🔧 Creating Main Window");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    console.log("🔗 Loading Dev UI at http://localhost:5173");
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    console.log("📦 Loading Production UI");
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function createAgentWindow() {
  console.log("🔧 Creating Agent Window (hidden)");
  agentWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,  // keep hidden until navigation
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  agentWindow.loadURL("about:blank");
}

app.whenReady().then(() => {
  console.log("🚀 App is ready");
  createMainWindow();
  createAgentWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log("🔄 Re-creating windows on activate");
      createMainWindow();
      createAgentWindow();
    }
  });
});

app.on("window-all-closed", () => {
  console.log("✖ All windows closed");
  if (process.platform !== "darwin") app.quit();
});

// IPC: open any URL in Agent Window
// IPC: open any URL in Agent Window
ipcMain.handle("open-agent-url", async (_evt, url) => {
  console.log("📨 IPC open-agent-url:", url);
  if (!agentWindow) {
    console.error("❌ Agent window not available");
    return { status: "error", message: "Agent window missing" };
  }
  try {
    // 1. Navigate the hidden window
    await agentWindow.loadURL(url);
    // 2. Now un-hide it so you can see the page
    agentWindow.show();
    agentWindow.focus();
    console.log("✅ Agent window loaded & shown:", url);
    return { status: "success" };
  } catch (err) {
    console.error("❌ Failed to load URL in agent window:", err.message);
    return { status: "error", message: err.message };
  }
});


// IPC: extract DOM HTML
ipcMain.handle("get-agent-html", async () => {
  console.log("📨 IPC get-agent-html");
  if (!agentWindow) {
    console.error("❌ Agent window not available");
    return "";
  }
  try {
    const html = await agentWindow.webContents.executeJavaScript(
      "document.documentElement.outerHTML"
    );
    console.log("✅ Extracted HTML length:", html.length);
    return html;
  } catch (err) {
    console.error("❌ Failed to extract HTML:", err.message);
    return "";
  }
});

// 🏃‍♂️ IPC: execute a plan of actions on the agentWindow
ipcMain.handle("execute-actions", async (_evt, actions) => {
  console.log("📨 IPC execute-actions:", actions);
  if (!agentWindow) {
    console.error("❌ AgentWindow missing");
    return { status: "error", message: "No agent window" };
  }
  // Ensure the window is visible before any DOM work
  agentWindow.show();

  const results = [];
  for (const act of actions) {
    try {
      if (act.action === "navigate") {
        console.log("➡️ Navigating agentWindow to:", act.url);
        await agentWindow.loadURL(act.url);
        agentWindow.show();  // make the window visible
        results.push({ ...act, status: "done" });
        continue;
      }

      if (act.action === "click") {
        console.log("🖱️ Clicking selector:", act.selector);
        await agentWindow.webContents.executeJavaScript(
          `document.querySelector(\`${act.selector}\`)?.click()`
        );
      } else if (act.action === "type") {
        console.log("⌨️ Typing into selector:", act.selector, "value:", act.value);
        await agentWindow.webContents.executeJavaScript(
          `document.querySelector(\`${act.selector}\`).value = \`${act.value}\``
        );
      } else if (act.action === "scroll") {
        console.log("🗜️ Scrolling to selector:", act.selector);
        await agentWindow.webContents.executeJavaScript(
          `document.querySelector(\`${act.selector}\`).scrollIntoView()`
        );
      } else {
        console.warn("⚠️ Unknown action:", act);
      }

      results.push({ ...act, status: "done" });
    } catch (err) {
      console.error("❌ Action failed:", act, err.message);
      results.push({ ...act, status: "error", message: err.message });
    }
  }

  console.log("✅ All actions executed:", results);
  return { status: "done", results };
});
