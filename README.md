# chrome-window-manager

> Chrome Windows API wrapper -- create, resize, position, snap, and manage window state for MV3 extensions.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install chrome-window-manager
```

## Usage

```js
import { WindowManager, WindowSnap } from 'chrome-window-manager';

// Create a centered popup window
const win = await WindowManager.centered('https://example.com', 800, 600);

// Create a small popup
const popup = await WindowManager.popup('popup.html', 400, 500);

// Resize and move an existing window
await WindowManager.resize(win.id, 1024, 768);
await WindowManager.move(win.id, 100, 50);

// Window state management
await WindowManager.maximize(win.id);
await WindowManager.minimize(win.id);
await WindowManager.fullscreen(win.id);
await WindowManager.restore(win.id);

// Snap windows to screen halves or quarters
await WindowSnap.left(win.id);
await WindowSnap.right(win.id);
await WindowSnap.top(win.id);
await WindowSnap.bottom(win.id);
await WindowSnap.quarter(win.id, 'tl'); // top-left quarter

// Focus or close
await WindowManager.focus(win.id);
await WindowManager.close(win.id);

// List all open windows
const allWindows = await WindowManager.getAll();
```

## API

### `WindowManager`

All methods are static and async.

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `create` | `options?: { url?, width?, height?, left?, top?, type?, focused? }` | `Promise<chrome.windows.Window>` | Create a new window with optional configuration |
| `popup` | `url: string, width?: number, height?: number` | `Promise<chrome.windows.Window>` | Create a focused popup window (defaults: 400x600) |
| `centered` | `url: string, width?: number, height?: number` | `Promise<chrome.windows.Window>` | Create a centered window (defaults: 800x600) |
| `getCurrent` | none | `Promise<chrome.windows.Window>` | Get the current window |
| `getAll` | none | `Promise<chrome.windows.Window[]>` | Get all windows with populated tabs |
| `focus` | `windowId: number` | `Promise<void>` | Bring a window to the foreground |
| `resize` | `windowId: number, width: number, height: number` | `Promise<void>` | Resize a window |
| `move` | `windowId: number, left: number, top: number` | `Promise<void>` | Move a window to a screen position |
| `minimize` | `windowId: number` | `Promise<void>` | Minimize a window |
| `maximize` | `windowId: number` | `Promise<void>` | Maximize a window |
| `fullscreen` | `windowId: number` | `Promise<void>` | Set a window to fullscreen |
| `restore` | `windowId: number` | `Promise<void>` | Restore a window to normal state |
| `close` | `windowId: number` | `Promise<void>` | Close a window |

### `WindowSnap`

All methods are static and async. Snap windows to predefined screen positions.

| Method | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| `left` | `windowId: number` | `Promise<void>` | Snap to left half of screen |
| `right` | `windowId: number` | `Promise<void>` | Snap to right half of screen |
| `top` | `windowId: number` | `Promise<void>` | Snap to top half of screen |
| `bottom` | `windowId: number` | `Promise<void>` | Snap to bottom half of screen |
| `quarter` | `windowId: number, position: 'tl' \| 'tr' \| 'bl' \| 'br'` | `Promise<void>` | Snap to a screen quarter |

### `WindowManagerError`

Custom error class thrown by `WindowManager` methods.

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `code` | `string` | Machine-readable error code from `WindowManagerErrorCode` |
| `operation` | `string` | The method that threw the error |
| `originalError` | `Error \| undefined` | The underlying Chrome API error |

### `WindowManagerErrorCode`

| Code | Description |
|------|-------------|
| `WINDOW_NOT_FOUND` | Window ID does not exist |
| `WINDOW_CREATE_FAILED` | Failed to create a window |
| `WINDOW_UPDATE_FAILED` | Failed to update window properties |
| `WINDOW_REMOVE_FAILED` | Failed to close a window |
| `INVALID_WINDOW_ID` | Invalid window ID or parameters |
| `CHROME_API_ERROR` | General Chrome API error |
| `NO_WINDOW_CONTEXT` | No window context available |

## License

MIT
