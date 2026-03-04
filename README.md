# chrome-window-manager

[![npm version](https://img.shields.io/npm/v/chrome-window-manager)](https://npmjs.com/package/chrome-window-manager)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-window-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-window-manager/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-window-manager?style=social)](https://github.com/theluckystrike/chrome-window-manager)

> Window creation, manipulation, grouping, and state persistence for Chrome extensions.

**chrome-window-manager** provides comprehensive window management utilities for Chrome extensions. Create, manipulate, group, and persist window states with a simple, type-safe API.

Part of the [Zovo](https://zovo.one) developer tools family.

<p align="center">
  <a href="https://zovo.one">
    <img src="https://img.shields.io/badge/Visit-Zovo-orange?style=for-the-badge" alt="Zovo">
  </a>
  <a href="https://chrome.google.com/webstore/search/publishers/zovo">
    <img src="https://img.shields.io/badge/Chrome_Web_Store-18%2B%20Extensions-green?style=for-the-badge" alt="Chrome Web Store">
  </a>
</p>

## Features

- ✅ **Window Listing** - List all windows with filters
- ✅ **Window Creation** - Create new windows with custom properties
- ✅ **Window Manipulation** - Resize, move, focus, and update windows
- ✅ **Window Grouping** - Group windows by type or purpose
- ✅ **State Persistence** - Save and restore window states
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install chrome-window-manager
```

Or with yarn:

```bash
yarn add chrome-window-manager
```

## Quick Start

```typescript
import { WindowManager } from 'chrome-window-manager';

// List all windows
const windows = await WindowManager.list();

// Create a new window
const win = await WindowManager.create({
  url: 'https://example.com',
  focused: true
});

// Get a specific window
const window = await WindowManager.get(win.id);

// Update window
await WindowManager.update(win.id, { focused: true });
```

## Usage Examples

### List Windows

```typescript
import { WindowManager } from 'chrome-window-manager';

// List all windows
const allWindows = await WindowManager.list();

// Filter by type
const normalWindows = await WindowManager.list({ windowTypes: ['normal'] });
const popups = await WindowManager.list({ windowTypes: ['popup'] });

// Filter by focused state
const focusedWindows = await WindowManager.list({ focused: true });
```

### Create Windows

```typescript
import { WindowManager } from 'chrome-window-manager';

// Create a basic window
const win = await WindowManager.create({
  url: 'https://example.com'
});

// Create with options
const popup = await WindowManager.create({
  url: 'popup.html',
  type: 'popup',
  width: 400,
  height: 300,
  focused: true
});

// Create in specific position
const positioned = await WindowManager.create({
  url: 'panel.html',
  type: 'panel',
  left: 100,
  top: 100,
  width: 500,
  height: 400
});
```

### Update Windows

```typescript
import { WindowManager } from 'chrome-window-manager';

// Focus a window
await WindowManager.update(windowId, { focused: true });

// Resize window
await WindowManager.update(windowId, {
  width: 800,
  height: 600
});

// Move window
await WindowManager.update(windowId, {
  left: 200,
  top: 150
});

// Set always on top
await WindowManager.update(windowId, {
  alwaysOnTop: true
});
```

### Window State Management

```typescript
import { WindowManager } from 'chrome-window-manager';

// Save window state
const state = await WindowManager.getState(windowId);
await WindowManager.saveState('my-saved-window', state);

// Restore window state
const restored = await WindowManager.restoreState('my-saved-window');
```

### Window Grouping

```typescript
import { WindowManager } from 'chrome-window-manager';

// Group windows
const group = await WindowManager.group([
  windowId1,
  windowId2,
  windowId3
], 'My Window Group');

// Get windows in group
const windowsInGroup = await WindowManager.getGroup('My Window Group');

// Ungroup windows
await WindowManager.ungroup(group.id);
```

## API

| Method | Description |
|--------|-------------|
| `list(options?)` | List all windows with optional filters |
| `get(id)` | Get a specific window by ID |
| `create(options)` | Create a new window |
| `update(id, options)` | Update window properties |
| `remove(id)` | Close a window |
| `getState(id)` | Get current window state |
| `saveState(name, state)` | Save window state |
| `restoreState(name)` | Restore saved window state |
| `group(windowIds, name)` | Group windows together |
| `getGroup(name)` | Get windows in a group |

## Options

### Create Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string \| string[]` | - | URL(s) to open |
| `type` | `'normal' \| 'popup' \| 'panel' \| 'devtools'` | `'normal'` | Window type |
| `focused` | `boolean` | `true` | Focus the window |
| `left` | `number` | - | Window left position |
| `top` | `number` | - | Window top position |
| `width` | `number` | - | Window width |
| `height` | `number` | - | Window height |
| `alwaysOnTop` | `boolean` | `false` | Keep window on top |

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/window-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/window-feature`
7. **Submit** a Pull Request

### Development

```bash
# Clone the repository
git clone https://github.com/theluckystrike/chrome-window-manager.git
cd chrome-window-manager

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## See Also

### Related Zovo Repositories

- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper
- [chrome-tabs-api](https://github.com/theluckystrike/chrome-tabs-api) - Tab management utilities
- [webext-toast-notifications](https://github.com/theluckystrike/webext-toast-notifications) - Toast notification system
- [chrome-tts-api](https://github.com/theluckystrike/chrome-tts-api) - Text-to-speech API

### Zovo Chrome Extensions

| Extension | Description | Chrome Web Store |
|-----------|-------------|------------------|
| [Tab Suspender Pro](https://chrome.google.com/webstore/detail/tab-suspender-pro) | Suspend inactive tabs to save memory | [Install](https://chrome.google.com/webstore/detail/tab-suspender-pro) |
| [Cookie Manager Pro](https://chrome.google.com/webstore/detail/cookie-manager-pro) | Advanced cookie management | [Install](https://chrome.google.com/webstore/detail/cookie-manager-pro) |
| [Clipboard History Pro](https://chrome.google.com/webstore/detail/clipboard-history-pro) | Advanced clipboard management | [Install](https://chrome.google.com/webstore/detail/clipboard-history-pro) |
| [JSON Viewer Pro](https://chrome.google.com/webstore/detail/json-viewer-pro) | Format and explore JSON | [Install](https://chrome.google.com/webstore/detail/json-viewer-pro) |

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)
