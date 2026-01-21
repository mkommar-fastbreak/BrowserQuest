
define(['text!../config/config_build.json'],
function(build) {
    var config = {
        dev: { host: "localhost", port: 8000, dispatcher: false },
        build: { host: "localhost", port: 8000 }
    };
    
    // Try to parse build config, fallback to default if it fails
    try {
        if (build && build.trim()) {
            var parsedConfig = JSON.parse(build);
            config.build = parsedConfig;
            console.log("✓ Loaded build config from config_build.json:", config.build);
        } else {
            console.warn("⚠ config_build.json is empty or missing");
        }
    } catch(e) {
        // config_build.json doesn't exist or is invalid, use default
        console.error("✗ Could not load config_build.json:", e.message);
        console.warn("Using default build config (localhost:8000)");
    }
    
    // Allow runtime override via window.BROWSERQUEST_CONFIG (useful for Vercel)
    // Only override if window.BROWSERQUEST_CONFIG is explicitly set (not from default)
    if (typeof window !== 'undefined' && window.BROWSERQUEST_CONFIG) {
        // Check if it was set explicitly (not from our default config.js)
        var wasExplicitlySet = !window.BROWSERQUEST_CONFIG._isDefault;
        if (wasExplicitlySet) {
            console.log("Using runtime config override:", window.BROWSERQUEST_CONFIG);
            if (window.BROWSERQUEST_CONFIG.host) {
                config.build.host = window.BROWSERQUEST_CONFIG.host;
            }
            if (window.BROWSERQUEST_CONFIG.port !== undefined) {
                config.build.port = parseInt(window.BROWSERQUEST_CONFIG.port, 10);
            }
        } else {
            console.log("Ignoring default config.js, using config_build.json");
        }
    }
    
    //>>excludeStart("prodHost", pragmas.prodHost);
    require(['text!../config/config_local.json'], function(local) {
        try {
            if (local && local.trim()) {
                config.local = JSON.parse(local);
            }
        } catch(e) {
            // Exception triggered when config_local.json does not exist. Nothing to do here.
        }
    }, function(err) {
        // config_local.json doesn't exist, that's fine for production builds
    });
    //>>excludeEnd("prodHost");
    
    return config;
});