import { app } from "electron";
import path from "path";
import fs from "fs";
import { io, Socket } from "socket.io-client";

export interface LocalState {
  locked: boolean;
  endsAt: string | null;
}

export interface Config {
  serverUrl: string;
  computerId: string;
  deviceToken: string;
}

let socket: Socket | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;
let expiryCheckInterval: NodeJS.Timeout | null = null;
let currentLockedState = true;

// Resolve the path to config.json safely for development and production
export function getConfigPath(): string {
  const devPath = path.join(process.cwd(), "config.json");
  const prodPath = path.join(path.dirname(process.execPath), "config.json");

  if (fs.existsSync(devPath)) {
    return devPath;
  }
  return prodPath;
}

export function loadConfig(): Config {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at: ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

export function getStatePath(): string {
  // Use Electron's safe AppData directory to prevent Windows permission issues
  return path.join(app.getPath("userData"), "state.json");
}

export function saveLocalState(state: LocalState) {
  try {
    fs.writeFileSync(getStatePath(), JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write state.json:", err);
  }
}

export function getLocalState(): LocalState {
  try {
    const statePath = getStatePath();
    if (fs.existsSync(statePath)) {
      return JSON.parse(fs.readFileSync(statePath, "utf8"));
    }
  } catch (err) {
    console.error("Failed to read state.json:", err);
  }
  return { locked: true, endsAt: null };
}

export function startSocketClient(
  onLock: () => void,
  onUnlock: (endsAt: string) => void
) {
  const config = loadConfig();
  console.log(`Connecting to CClub Server: ${config.serverUrl}...`);

  // Load initial local state
  const localState = getLocalState();
  currentLockedState = localState.locked;

  // Apply initial local state
  if (currentLockedState) {
    onLock();
  } else {
    // If it was unlocked, verify it hasn't expired yet
    if (localState.endsAt) {
      const remainingTime = new Date(localState.endsAt).getTime() - Date.now();
      if (remainingTime > 0) {
        onUnlock(localState.endsAt);
      } else {
        console.log("Offline state session expired. Locking screen.");
        currentLockedState = true;
        onLock();
        saveLocalState({ locked: true, endsAt: null });
      }
    } else {
      currentLockedState = true;
      onLock();
      saveLocalState({ locked: true, endsAt: null });
    }
  }

  // Connect to Socket.io Server
  socket = io(config.serverUrl, {
    auth: {
      deviceToken: config.deviceToken,
      computerId: config.computerId,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully to server.");
    // Run REST fallback check to align with server
    syncWithServer(config, onLock, onUnlock);
  });

  socket.on("disconnect", (reason) => {
    console.warn(`Socket disconnected. Reason: ${reason}`);
  });

  socket.on("pc:unlock", (data: { sessionId: string; endsAt: string }) => {
    console.log("Event 'pc:unlock' received:", data);
    currentLockedState = false;
    onUnlock(data.endsAt);
    saveLocalState({ locked: false, endsAt: data.endsAt });
  });

  socket.on("pc:lock", () => {
    console.log("Event 'pc:lock' received.");
    currentLockedState = true;
    onLock();
    saveLocalState({ locked: true, endsAt: null });
  });

  // Start 30-second Heartbeat Loop
  heartbeatInterval = setInterval(() => {
    if (socket && socket.connected) {
      socket.emit("pc:heartbeat");
      console.log("Heartbeat sent to server.");
    }
  }, 30 * 1000);

  // Start Offline Timer Expiry Loop (every 5 seconds)
  expiryCheckInterval = setInterval(() => {
    if (!currentLockedState) {
      const state = getLocalState();
      if (state.endsAt) {
        const endsAtMs = new Date(state.endsAt).getTime();
        if (Date.now() >= endsAtMs) {
          console.log("Session expired while offline/online. Locking screen.");
          currentLockedState = true;
          onLock();
          saveLocalState({ locked: true, endsAt: null });
        }
      }
    }
  }, 5000);
}

// REST Sync Fallback
async function syncWithServer(
  config: Config,
  onLock: () => void,
  onUnlock: (endsAt: string) => void
) {
  try {
    console.log("Syncing computer state with backend REST API...");
    const response = await fetch(`${config.serverUrl}/api/computers/${config.computerId}`);
    if (!response.ok) {
      throw new Error(`Sync request failed with status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Server state fetched:", data.status);

    if (data.status === "FREE") {
      currentLockedState = true;
      onLock();
      saveLocalState({ locked: true, endsAt: null });
    } else if (data.status === "OCCUPIED" || data.status === "ENDING_SOON") {
      const activeSession = data.sessions?.[0];
      if (activeSession && activeSession.status === "ACTIVE") {
        const endsAt = activeSession.endsAt;
        const endsAtMs = new Date(endsAt).getTime();
        if (Date.now() < endsAtMs) {
          currentLockedState = false;
          onUnlock(endsAt);
          saveLocalState({ locked: false, endsAt });
        } else {
          currentLockedState = true;
          onLock();
          saveLocalState({ locked: true, endsAt: null });
        }
      } else {
        currentLockedState = true;
        onLock();
        saveLocalState({ locked: true, endsAt: null });
      }
    }
  } catch (err: any) {
    console.error("REST sync fallback failed:", err.message);
  }
}

export function stopSocketClient() {
  if (socket) {
    socket.close();
  }
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  if (expiryCheckInterval) {
    clearInterval(expiryCheckInterval);
  }
}
