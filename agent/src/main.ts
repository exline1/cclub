import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import AutoLaunch from "auto-launch";
import { startSocketClient, stopSocketClient } from "./socket-client";

let mainWindow: BrowserWindow | null = null;
let isKioskLocked = true;

const BLOCKED_SHORTCUTS = [
  "Alt+Tab",
  "Alt+F4",
  "Alt+Space",
  "Ctrl+Esc",
  "CommandOrControl+Escape",
  "Alt+Escape",
];

function registerSystemShortcuts() {
  for (const shortcut of BLOCKED_SHORTCUTS) {
    globalShortcut.register(shortcut, () => {
      console.log(`Shortcut blocked: ${shortcut}`);
    });
  }
}

function unregisterSystemShortcuts() {
  globalShortcut.unregisterAll();
}

function enableAutoLaunch() {
  // Only register auto-launch for production builds
  if (app.isPackaged) {
    const launcher = new AutoLaunch({
      name: "CClub Kiosk Agent",
      path: process.execPath,
    });

    launcher
      .isEnabled()
      .then((isEnabled) => {
        if (!isEnabled) {
          launcher.enable();
          console.log("Auto-launch registered successfully.");
        }
      })
      .catch((err) => {
        console.error("Auto-launch registration failed:", err);
      });
  }
}

function createKioskWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    kiosk: true,
    frame: false,
    alwaysOnTop: true,
    fullscreen: true,
    autoHideMenuBar: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const htmlPath = path.join(__dirname, "../src/index.html");
  mainWindow.loadFile(htmlPath);

  // Prevent closing the kiosk window
  mainWindow.on("close", (e) => {
    if (isKioskLocked) {
      e.preventDefault();
    }
  });

  // Re-focus and keep on top if locked and blurred
  mainWindow.on("blur", () => {
    if (isKioskLocked && mainWindow) {
      setTimeout(() => {
        if (mainWindow) {
          mainWindow.focus();
          mainWindow.setAlwaysOnTop(true, "screen-saver");
        }
      }, 100);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

const lockKiosk = () => {
  console.log("Locking PC...");
  isKioskLocked = true;
  unregisterSystemShortcuts();
  registerSystemShortcuts();

  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setKiosk(true);
    mainWindow.setAlwaysOnTop(true, "screen-saver");
  }
};

const unlockKiosk = (endsAt: string) => {
  console.log(`Unlocking PC. Session ends at: ${endsAt}`);
  isKioskLocked = false;
  unregisterSystemShortcuts();

  if (mainWindow) {
    mainWindow.setKiosk(false);
    mainWindow.hide();
  }
};

app.whenReady().then(() => {
  createKioskWindow();
  enableAutoLaunch();

  // Initialize socket connection and pass lock/unlock handlers
  try {
    startSocketClient(lockKiosk, unlockKiosk);
  } catch (err: any) {
    console.error("Socket client startup failed:", err.message);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createKioskWindow();
    }
  });
});

app.on("will-quit", () => {
  unregisterSystemShortcuts();
  stopSocketClient();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
