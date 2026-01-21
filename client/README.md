# BrowserQuest Client

## Development Setup

1. Configure the client for local development:
   ```bash
   cp config/config_local.json-dist config/config_local.json
   # Edit config_local.json to match your server settings
   ```

2. Serve the client files using a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js http-server
   http-server -p 8080
   ```

3. Open `http://localhost:8080` in your browser.

## Production Build

For production, build an optimized version:

1. Configure the production WebSocket host:
   ```bash
   cp config/config_build.json-dist config/config_build.json
   # Edit config_build.json with your production server host/port
   ```

2. Build the client:
   ```bash
   npm run build
   ```

This creates an optimized build in `../client-build/` that can be deployed to any static file server.

## Configuration Files

- `config_local.json`: Development configuration (not included in build)
- `config_build.json`: Production configuration (included in build)

**Configuration Options:**
- `host`: WebSocket server hostname
- `port`: WebSocket server port
- `dispatcher`: (local only) Whether to use dispatcher mode

See the main README.md for full documentation.
