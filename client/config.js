// Runtime configuration for Vercel deployment
// This file can be customized per deployment
// Set window.BROWSERQUEST_CONFIG before the game loads to override config_build.json

(function() {
    // Mark as default so it won't override config_build.json
    // Only set if explicitly needed - otherwise use config_build.json
    // To override, set window.BROWSERQUEST_CONFIG = { host: '...', port: ... } 
    // BEFORE this script runs, or uncomment below:
    /*
    if (typeof window !== 'undefined') {
        window.BROWSERQUEST_CONFIG = {
            host: 'browserquest-production.up.railway.app',
            port: 443,
            _isDefault: false  // Mark as explicit override
        };
    }
    */
    
    // Don't set defaults - let config_build.json be used
})();
