# BrowserQuest Server

## Quick Start

1. Install dependencies from the project root:
   ```bash
   npm install
   ```

2. Configure the server:
   ```bash
   cp config_local.json-dist config_local.json
   # Edit config_local.json with your settings
   ```

3. Start the server:
   ```bash
   npm start
   # or
   node js/main.js
   ```

## Configuration

The server reads configuration from `config.json` (default) or `config_local.json` (overrides default).

**Configuration Options:**
- `port`: WebSocket server port (default: 8000)
- `debug_level`: Logging level - "error", "warn", "info", or "debug" (default: "info")
- `nb_players_per_world`: Maximum players per world instance (default: 200)
- `nb_worlds`: Number of world instances (default: 5)
- `map_filepath`: Path to the world map JSON file
- `metrics_enabled`: Enable metrics collection (default: false)

**Environment Variables:**
- `BROWSERQUEST_PORT`: Server port
- `BROWSERQUEST_DEBUG_LEVEL`: Logging level
- `BROWSERQUEST_PLAYERS_PER_WORLD`: Players per world
- `BROWSERQUEST_NB_WORLDS`: Number of worlds
- `BROWSERQUEST_METRICS_ENABLED`: Enable metrics (true/false)

## Status Endpoint

The server provides a status endpoint for monitoring:

```
GET http://localhost:8000/status
```

Returns a JSON array with the number of players in each world instance.

## Dependencies

- `ws`: Modern WebSocket library
- `underscore`: Utility functions
- `sanitizer`: Input sanitization

See the main README.md for full documentation.
