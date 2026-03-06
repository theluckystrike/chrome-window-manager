# chrome-window-manager

[![npm version](https://img.shields.io/npm/v/chrome-window-manager)](https://npmjs.com/package/chrome-window-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

Chrome Windows API wrapper for MV3 extensions. Create, resize, position, snap, and manage window state from a single static class. TypeScript-first with structured error handling.

Requires the `windows` permission in your manifest.json.


INSTALL

```bash
npm install chrome-window-manager
```


EXPORTS

The package exposes four named exports from the main entry point.

```ts
import { WindowManager, WindowSnap, WindowManagerError, WindowManagerErrorCode } from 'chrome-window-manager';
```

- WindowManager provides all window lifecycle and layout operations as static async methods.
- WindowSnap provides screen-half and quarter snapping.
- WindowManagerError is the custom error class thrown on failures.
- WindowManagerErrorCode is an object of string constants for machine-readable error codes.


QUICK START

```ts
import { WindowManager, WindowSnap } from 'chrome-window-manager';

// Create a centered window (defaults to 800x600)
const win = await WindowManager.centered('https://example.com', 800, 600);

// Create a popup (defaults to 400x600)
const popup = await WindowManager.popup('popup.html', 400, 500);

// Resize and reposition
await WindowManager.resize(win.id, 1024, 768);
await WindowManager.move(win.id, 100, 50);

// Window state
await WindowManager.maximize(win.id);
await WindowManager.minimize(win.id);
await WindowManager.fullscreen(win.id);
await WindowManager.restore(win.id);

// Snap to screen halves
await WindowSnap.left(win.id);
await WindowSnap.right(win.id);
await WindowSnap.top(win.id);
await WindowSnap.bottom(win.id);

// Snap to a quarter (tl, tr, bl, br)
await WindowSnap.quarter(win.id, 'tl');

// Focus, close, list
await WindowManager.focus(win.id);
await WindowManager.close(win.id);
const all = await WindowManager.getAll();
```


WINDOWMANAGER API

All methods are static and return promises.

WindowManager.create(options?)
Creates a new window. Options accept url, width, height, left, top, type ("normal", "popup", or "panel"), and focused. Returns the chrome.windows.Window object.

WindowManager.popup(url, width?, height?)
Shortcut for creating a focused popup. Defaults to 400x600.

WindowManager.centered(url, width?, height?)
Creates a window centered on the screen. Defaults to 800x600. Screen size is estimated from the current window dimensions.

WindowManager.getCurrent()
Returns the current chrome.windows.Window.

WindowManager.getAll()
Returns all windows with tabs populated.

WindowManager.focus(windowId)
Brings a window to the foreground.

WindowManager.resize(windowId, width, height)
Sets a window to the given pixel dimensions.

WindowManager.move(windowId, left, top)
Repositions a window by screen coordinates.

WindowManager.minimize(windowId)
Minimizes the window.

WindowManager.maximize(windowId)
Maximizes the window.

WindowManager.fullscreen(windowId)
Sets the window to fullscreen. Requires the "fullscreen" permission in manifest.json.

WindowManager.restore(windowId)
Restores a minimized or maximized window to normal state.

WindowManager.close(windowId)
Closes and removes the window.


WINDOWSNAP API

All methods are static and return promises. Snap targets use a default screen size of 1920x1080.

WindowSnap.left(windowId) - left half of the screen
WindowSnap.right(windowId) - right half of the screen
WindowSnap.top(windowId) - top half of the screen
WindowSnap.bottom(windowId) - bottom half of the screen
WindowSnap.quarter(windowId, position) - one quarter of the screen, where position is "tl", "tr", "bl", or "br"


ERROR HANDLING

All WindowManager methods throw WindowManagerError on failure. Each error carries four properties.

- message - human-readable description
- code - one of the WindowManagerErrorCode constants
- operation - the method name that threw
- originalError - the underlying Chrome API error, if any

WindowManagerErrorCode values

WINDOW_NOT_FOUND - the window ID does not exist or was already closed
WINDOW_CREATE_FAILED - window creation failed
WINDOW_UPDATE_FAILED - failed to update window properties
WINDOW_REMOVE_FAILED - failed to close a window
INVALID_WINDOW_ID - the window ID or parameters were invalid
CHROME_API_ERROR - general Chrome API error
NO_WINDOW_CONTEXT - no window context available

```ts
import { WindowManager, WindowManagerError, WindowManagerErrorCode } from 'chrome-window-manager';

try {
  await WindowManager.focus(9999);
} catch (err) {
  if (err instanceof WindowManagerError && err.code === WindowManagerErrorCode.WINDOW_NOT_FOUND) {
    console.log('That window is gone.');
  }
}
```


MANIFEST PERMISSIONS

Your extension needs at minimum the windows permission. Add fullscreen if you plan to use WindowManager.fullscreen().

```json
{
  "permissions": ["windows"]
}
```


LICENSE

MIT. See LICENSE file.


ABOUT

Built by theluckystrike. Part of the extension tooling from zovo.one.

https://github.com/theluckystrike/chrome-window-manager
