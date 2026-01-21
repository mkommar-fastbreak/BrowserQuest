
// Simple logging module
// Replaces the deprecated 'log' package

var logInstance = null;

function createLogger(level) {
    var levels = { error: 0, warn: 1, info: 2, debug: 3 };
    var currentLevel = levels[level] || levels.info;
    
    return {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3,
        
        error: function() {
            if (currentLevel >= levels.error) {
                console.error.apply(console, ['[ERROR]'].concat(Array.prototype.slice.call(arguments)));
            }
        },
        warn: function() {
            if (currentLevel >= levels.warn) {
                console.warn.apply(console, ['[WARN]'].concat(Array.prototype.slice.call(arguments)));
            }
        },
        info: function() {
            if (currentLevel >= levels.info) {
                console.log.apply(console, ['[INFO]'].concat(Array.prototype.slice.call(arguments)));
            }
        },
        debug: function() {
            if (currentLevel >= levels.debug) {
                console.log.apply(console, ['[DEBUG]'].concat(Array.prototype.slice.call(arguments)));
            }
        }
    };
}

// Default logger
var defaultLogger = createLogger('info');

// Export factory function
module.exports = function(level) {
    if (level !== undefined) {
        return createLogger(level);
    }
    return defaultLogger;
};

// Also export constants and methods for compatibility
module.exports.ERROR = 0;
module.exports.WARN = 1;
module.exports.INFO = 2;
module.exports.DEBUG = 3;

// Set global log instance
module.exports.setGlobal = function(level) {
    logInstance = createLogger(level);
    global.log = logInstance;
    return logInstance;
};

// Get global log instance
module.exports.getGlobal = function() {
    if (!logInstance) {
        logInstance = defaultLogger;
        global.log = logInstance;
    }
    return logInstance;
};
