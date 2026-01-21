// Runtime configuration for Vercel deployment
// This file can be customized per deployment
// Set window.BROWSERQUEST_CONFIG before the game loads

(function() {
    // Example: Set server URL from environment or default
    // In Vercel, you can inject this via a build script or use Next.js env vars
    if (typeof window !== 'undefined' && !window.BROWSERQUEST_CONFIG) {
        // Default configuration - update this with your server URL
        window.BROWSERQUEST_CONFIG = {
            host: 'localhost',
            port: 8000
        };
    }
})();
