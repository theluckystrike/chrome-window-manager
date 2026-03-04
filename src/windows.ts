/**
 * Window Manager — Chrome Windows API wrapper
 */

export class WindowManagerError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'WindowManagerError';
        if (originalError && originalError.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const WindowManagerErrorCode = {
    WINDOW_NOT_FOUND: 'WINDOW_NOT_FOUND',
    WINDOW_CREATE_FAILED: 'WINDOW_CREATE_FAILED',
    WINDOW_UPDATE_FAILED: 'WINDOW_UPDATE_FAILED',
    WINDOW_REMOVE_FAILED: 'WINDOW_REMOVE_FAILED',
    INVALID_WINDOW_ID: 'INVALID_WINDOW_ID',
    CHROME_API_ERROR: 'CHROME_API_ERROR',
    NO_WINDOW_CONTEXT: 'NO_WINDOW_CONTEXT',
} as const;

/**
 * Window Manager — Chrome Windows API wrapper with proper error handling
 */
export class WindowManager {
    /** Create a new window */
    static async create(options: { url?: string; width?: number; height?: number; left?: number; top?: number; type?: 'normal' | 'popup' | 'panel'; focused?: boolean } = {}): Promise<chrome.windows.Window> {
        try {
            return await chrome.windows.create(options) as chrome.windows.Window;
        } catch (error) {
            throw new WindowManagerError(
                `Failed to create window: ${(error as Error).message}. ` +
                'Make sure you have the "windows" permission in your manifest.',
                WindowManagerErrorCode.WINDOW_CREATE_FAILED,
                'create',
                error as Error
            );
        }
    }

    /** Create a popup window */
    static async popup(url: string, width: number = 400, height: number = 600): Promise<chrome.windows.Window> {
        if (!url || typeof url !== 'string') {
            throw new WindowManagerError(
                `Invalid URL: must be a non-empty string. Received: ${typeof url}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'popup'
            );
        }
        return this.create({ url, width, height, type: 'popup', focused: true });
    }

    /** Create a centered window */
    static async centered(url: string, width: number = 800, height: number = 600): Promise<chrome.windows.Window> {
        if (!url || typeof url !== 'string') {
            throw new WindowManagerError(
                `Invalid URL: must be a non-empty string. Received: ${typeof url}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'centered'
            );
        }
        if (width <= 0 || height <= 0) {
            throw new WindowManagerError(
                `Invalid dimensions: width and height must be positive numbers. Received: width=${width}, height=${height}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'centered'
            );
        }
        try {
            const screen = await this.getScreenSize();
            const left = Math.round((screen.width - width) / 2);
            const top = Math.round((screen.height - height) / 2);
            return await this.create({ url, width, height, left, top, focused: true });
        } catch (error) {
            if (error instanceof WindowManagerError) throw error;
            throw new WindowManagerError(
                `Failed to create centered window: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_CREATE_FAILED,
                'centered',
                error as Error
            );
        }
    }

    /** Get current window */
    static async getCurrent(): Promise<chrome.windows.Window> {
        try {
            return await chrome.windows.getCurrent();
        } catch (error) {
            throw new WindowManagerError(
                `Failed to get current window: ${(error as Error).message}. ` +
                'This may happen if called outside a Chrome extension context.',
                WindowManagerErrorCode.CHROME_API_ERROR,
                'getCurrent',
                error as Error
            );
        }
    }

    /** Get all windows */
    static async getAll(): Promise<chrome.windows.Window[]> {
        try {
            return await chrome.windows.getAll({ populate: true });
        } catch (error) {
            throw new WindowManagerError(
                `Failed to get all windows: ${(error as Error).message}. ` +
                'Make sure you have the "windows" permission in your manifest.',
                WindowManagerErrorCode.CHROME_API_ERROR,
                'getAll',
                error as Error
            );
        }
    }

    /** Focus a window */
    static async focus(windowId: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'focus'
            );
        }
        try {
            await chrome.windows.update(windowId, { focused: true });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'focus',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to focus window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'focus',
                error as Error
            );
        }
    }

    /** Resize a window */
    static async resize(windowId: number, width: number, height: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'resize'
            );
        }
        if (width <= 0 || height <= 0) {
            throw new WindowManagerError(
                `Invalid dimensions: width and height must be positive numbers. Received: width=${width}, height=${height}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'resize'
            );
        }
        try {
            await chrome.windows.update(windowId, { width, height });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'resize',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to resize window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'resize',
                error as Error
            );
        }
    }

    /** Move a window */
    static async move(windowId: number, left: number, top: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'move'
            );
        }
        if (typeof left !== 'number' || typeof top !== 'number') {
            throw new WindowManagerError(
                `Invalid position: left and top must be numbers. Received: left=${left}, top=${top}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'move'
            );
        }
        try {
            await chrome.windows.update(windowId, { left, top });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'move',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to move window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'move',
                error as Error
            );
        }
    }

    /** Minimize */
    static async minimize(windowId: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'minimize'
            );
        }
        try {
            await chrome.windows.update(windowId, { state: 'minimized' });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'minimize',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to minimize window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'minimize',
                error as Error
            );
        }
    }

    /** Maximize */
    static async maximize(windowId: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'maximize'
            );
        }
        try {
            await chrome.windows.update(windowId, { state: 'maximized' });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'maximize',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to maximize window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'maximize',
                error as Error
            );
        }
    }

    /** Fullscreen */
    static async fullscreen(windowId: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'fullscreen'
            );
        }
        try {
            await chrome.windows.update(windowId, { state: 'fullscreen' });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'fullscreen',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to set fullscreen for window ${windowId}: ${(error as Error).message}. ` +
                'Note: Fullscreen requires the "fullscreen" permission in manifest.json.',
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'fullscreen',
                error as Error
            );
        }
    }

    /** Restore (un-minimize/un-maximize) */
    static async restore(windowId: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'restore'
            );
        }
        try {
            await chrome.windows.update(windowId, { state: 'normal' });
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'restore',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to restore window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_UPDATE_FAILED,
                'restore',
                error as Error
            );
        }
    }

    /** Close a window */
    static async close(windowId: number): Promise<void> {
        if (typeof windowId !== 'number' || windowId <= 0) {
            throw new WindowManagerError(
                `Invalid window ID: must be a positive number. Received: ${windowId}`,
                WindowManagerErrorCode.INVALID_WINDOW_ID,
                'close'
            );
        }
        try {
            await chrome.windows.remove(windowId);
        } catch (error) {
            if ((error as Error).message?.includes('No window with id')) {
                throw new WindowManagerError(
                    `Window not found: No window with ID ${windowId}. The window may have been closed.`,
                    WindowManagerErrorCode.WINDOW_NOT_FOUND,
                    'close',
                    error as Error
                );
            }
            throw new WindowManagerError(
                `Failed to close window ${windowId}: ${(error as Error).message}`,
                WindowManagerErrorCode.WINDOW_REMOVE_FAILED,
                'close',
                error as Error
            );
        }
    }

    /** Get approximate screen size */
    private static async getScreenSize(): Promise<{ width: number; height: number }> {
        try {
            const win = await chrome.windows.getCurrent();
            return { 
                width: (win.width || 1920) + (win.left || 0) * 2, 
                height: (win.height || 1080) + (win.top || 0) * 2 
            };
        } catch (error) {
            // Return default screen size if we can't get current window
            return { width: 1920, height: 1080 };
        }
    }
}
