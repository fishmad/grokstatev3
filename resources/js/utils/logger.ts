// Logger utility for conditional debug/info/warn/error logging
export const logger = {
    debug: (...args: any[]) => {
        // @ts-ignore
        if (window.DEBUG_FEATURES_ENABLED) {
            // eslint-disable-next-line no-console
            console.debug(...args);
        }
    },
    info: (...args: any[]) => {
        // @ts-ignore
        if (window.DEBUG_FEATURES_ENABLED) {
            // eslint-disable-next-line no-console
            console.info(...args);
        }
    },
    warn: (...args: any[]) => {
        // @ts-ignore
        if (window.DEBUG_FEATURES_ENABLED) {
            // eslint-disable-next-line no-console
            console.warn(...args);
        }
    },
    error: (...args: any[]) => {
        // @ts-ignore
        if (window.DEBUG_FEATURES_ENABLED) {
            // eslint-disable-next-line no-console
            console.error(...args);
        }
    },
};
