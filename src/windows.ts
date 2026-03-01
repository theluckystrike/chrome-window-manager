/**
 * Window Manager — Chrome Windows API wrapper
 */
export class WindowManager {
    /** Create a new window */
    static async create(options?: { url?: string; width?: number; height?: number; left?: number; top?: number; type?: 'normal' | 'popup' | 'panel'; focused?: boolean }): Promise<chrome.windows.Window> {
        return chrome.windows.create(options);
    }

    /** Create a popup window */
    static async popup(url: string, width: number = 400, height: number = 600): Promise<chrome.windows.Window> {
        return this.create({ url, width, height, type: 'popup', focused: true });
    }

    /** Create a centered window */
    static async centered(url: string, width: number = 800, height: number = 600): Promise<chrome.windows.Window> {
        const screen = await this.getScreenSize();
        const left = Math.round((screen.width - width) / 2);
        const top = Math.round((screen.height - height) / 2);
        return this.create({ url, width, height, left, top, focused: true });
    }

    /** Get current window */
    static async getCurrent(): Promise<chrome.windows.Window> { return chrome.windows.getCurrent(); }

    /** Get all windows */
    static async getAll(): Promise<chrome.windows.Window[]> { return chrome.windows.getAll({ populate: true }); }

    /** Focus a window */
    static async focus(windowId: number): Promise<void> { await chrome.windows.update(windowId, { focused: true }); }

    /** Resize a window */
    static async resize(windowId: number, width: number, height: number): Promise<void> {
        await chrome.windows.update(windowId, { width, height });
    }

    /** Move a window */
    static async move(windowId: number, left: number, top: number): Promise<void> {
        await chrome.windows.update(windowId, { left, top });
    }

    /** Minimize */
    static async minimize(windowId: number): Promise<void> { await chrome.windows.update(windowId, { state: 'minimized' }); }

    /** Maximize */
    static async maximize(windowId: number): Promise<void> { await chrome.windows.update(windowId, { state: 'maximized' }); }

    /** Fullscreen */
    static async fullscreen(windowId: number): Promise<void> { await chrome.windows.update(windowId, { state: 'fullscreen' }); }

    /** Restore (un-minimize/un-maximize) */
    static async restore(windowId: number): Promise<void> { await chrome.windows.update(windowId, { state: 'normal' }); }

    /** Close a window */
    static async close(windowId: number): Promise<void> { await chrome.windows.remove(windowId); }

    /** Get approximate screen size */
    private static async getScreenSize(): Promise<{ width: number; height: number }> {
        const win = await chrome.windows.getCurrent();
        return { width: (win.width || 1920) + (win.left || 0) * 2, height: (win.height || 1080) + (win.top || 0) * 2 };
    }
}
