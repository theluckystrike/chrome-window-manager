# chrome-window-manager — Windows API Wrapper for Chrome Extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)**

**Chrome Windows API wrapper** — create, popup, centered windows, resize, move, minimize/maximize/fullscreen, and snap to screen positions.

## 🚀 Quick Start
```typescript
import { WindowManager, WindowSnap } from 'chrome-window-manager';
await WindowManager.popup('options.html', 400, 600);
await WindowManager.centered('dashboard.html', 800, 600);
await WindowSnap.left(windowId);
await WindowSnap.quarter(windowId, 'tr'); // top-right quarter
```

## 📄 License
MIT — [Zovo](https://zovo.one)
