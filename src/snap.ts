/**
 * Window Snap — Snap windows to screen positions
 */
export class WindowSnap {
    /** Snap to left half */
    static async left(windowId: number): Promise<void> {
        const screen = await this.screenSize();
        await chrome.windows.update(windowId, { left: 0, top: 0, width: Math.round(screen.width / 2), height: screen.height, state: 'normal' });
    }

    /** Snap to right half */
    static async right(windowId: number): Promise<void> {
        const screen = await this.screenSize();
        await chrome.windows.update(windowId, { left: Math.round(screen.width / 2), top: 0, width: Math.round(screen.width / 2), height: screen.height, state: 'normal' });
    }

    /** Snap to top half */
    static async top(windowId: number): Promise<void> {
        const screen = await this.screenSize();
        await chrome.windows.update(windowId, { left: 0, top: 0, width: screen.width, height: Math.round(screen.height / 2), state: 'normal' });
    }

    /** Snap to bottom half */
    static async bottom(windowId: number): Promise<void> {
        const screen = await this.screenSize();
        await chrome.windows.update(windowId, { left: 0, top: Math.round(screen.height / 2), width: screen.width, height: Math.round(screen.height / 2), state: 'normal' });
    }

    /** Snap to quarter (top-left, top-right, bottom-left, bottom-right) */
    static async quarter(windowId: number, position: 'tl' | 'tr' | 'bl' | 'br'): Promise<void> {
        const screen = await this.screenSize();
        const hw = Math.round(screen.width / 2); const hh = Math.round(screen.height / 2);
        const pos = { tl: { left: 0, top: 0 }, tr: { left: hw, top: 0 }, bl: { left: 0, top: hh }, br: { left: hw, top: hh } };
        await chrome.windows.update(windowId, { ...pos[position], width: hw, height: hh, state: 'normal' });
    }

    private static async screenSize(): Promise<{ width: number; height: number }> {
        const win = await chrome.windows.getCurrent();
        return { width: 1920, height: 1080 }; // Best estimate without screen API
    }
}
