# BrowserQuest

A modernized HTML5/JavaScript multiplayer game experiment, updated for 2026.

BrowserQuest is a multiplayer game inviting you to explore a world of adventure from your Web browser. This demo is powered by HTML5 and WebSockets, which allow for real-time gaming and apps on the Web.

## Features

- Real-time multiplayer gameplay using WebSockets
- HTML5 canvas-based rendering
- Cross-platform support (desktop and mobile browsers)
- Modern Node.js server architecture
- Simple deployment and configuration

## Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- A modern web browser with WebSocket support (Chrome, Firefox, Safari, Edge)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure the Server

The server uses `server/config.json` by default. You can override settings by creating `server/config_local.json`:

```bash
cp server/config_local.json-dist server/config_local.json
# Edit server/config_local.json with your settings
```

**Configuration Options:**
- `port`: WebSocket server port (default: 8000)
- `debug_level`: Logging level - "error", "warn", "info", or "debug" (default: "info")
- `nb_players_per_world`: Maximum players per world instance (default: 200)
- `nb_worlds`: Number of world instances (default: 5)
- `map_filepath`: Path to the world map JSON file
- `metrics_enabled`: Enable metrics collection (default: false)

**Environment Variables:**
You can also override configuration using environment variables:
- `BROWSERQUEST_PORT`: Server port
- `BROWSERQUEST_DEBUG_LEVEL`: Logging level
- `BROWSERQUEST_PLAYERS_PER_WORLD`: Players per world
- `BROWSERQUEST_NB_WORLDS`: Number of worlds
- `BROWSERQUEST_METRICS_ENABLED`: Enable metrics (true/false)

### 3. Start the Server

```bash
npm start
```

Or:

```bash
node server/js/main.js
```

The server will start on port 8000 by default. You should see:
```
[INFO] Server is listening on port 8000
[INFO] Starting BrowserQuest game server...
```

### 4. Configure the Client (Development)

For local development, create a client config file:

```bash
cp client/config/config_local.json-dist client/config/config_local.json
# Edit client/config/config_local.json to match your server settings
```

The default local config connects to `localhost:8000`.

### 5. Open the Game

Open `client/index.html` in your web browser, or serve it using a local web server:

```bash
# Using Python 3
cd client
python3 -m http.server 8080

# Using Node.js http-server (install with: npm install -g http-server)
cd client
npx http-server -p 8080
```

Then navigate to `http://localhost:8080` in your browser.

## Production Deployment

### Quick Deploy to Vercel

The easiest way to deploy BrowserQuest is using Vercel for the client and Railway/Render for the server.

**See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for complete deployment instructions.**

Quick start:
1. Deploy server to Railway: `railway up`
2. Deploy client to Vercel: `vercel`
3. Set environment variables in Vercel dashboard

### Building the Client

For production, you should build an optimized version of the client:

```bash
npm run build
```

This creates an optimized build in `client-build/` directory that can be deployed to any static file server.

**Before building**, configure the production WebSocket host:

```bash
cp client/config/config_build.json-dist client/config/config_build.json
# Edit client/config/config_build.json with your production server host/port
```

### Deploying the Server

1. Copy the `server/` and `shared/` directories to your production server
2. Install dependencies: `npm install --production`
3. Configure `server/config.json` or `server/config_local.json`
4. Start the server: `npm start`

### Using a Process Manager (Recommended)

For production, use a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the server with PM2
pm2 start server/js/main.js --name browserquest

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY server/ ./server/
COPY shared/ ./shared/

EXPOSE 8000

CMD ["node", "server/js/main.js"]
```

Build and run:

```bash
docker build -t browserquest .
docker run -p 8000:8000 browserquest
```

### Platform-Specific Deployment

- **Vercel**: See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for client deployment
- **Railway**: Use `railway.json` configuration file
- **Render**: Use `render.yaml` configuration file
- **Fly.io**: See VERCEL_DEPLOY.md for Fly.io setup

## Server Status Endpoint

The server provides a status endpoint for monitoring:

```bash
curl http://localhost:8000/status
```

Returns a JSON array with the number of players in each world instance.

## Project Structure

```
BrowserQuest/
├── client/           # Client-side game code
│   ├── js/          # JavaScript game logic
│   ├── css/         # Stylesheets
│   ├── img/         # Game assets
│   └── config/      # Client configuration
├── server/          # Server-side code
│   ├── js/          # Server logic
│   ├── maps/        # World map data
│   └── config.json  # Server configuration
├── shared/          # Shared code between client and server
└── bin/             # Build scripts
```

## Development

### Running in Development Mode

The server runs the same way in development and production. For client development:

1. Use the local config (`config_local.json`)
2. Serve the client files with a local web server (see Quick Start)
3. The client will connect to your local server

### Debugging

Set the server debug level to "debug" for verbose logging:

```json
{
  "debug_level": "debug"
}
```

Or use the environment variable:

```bash
BROWSERQUEST_DEBUG_LEVEL=debug npm start
```

## Troubleshooting

### Server won't start
- Check that port 8000 (or your configured port) is not in use
- Verify `server/config.json` exists and is valid JSON
- Check Node.js version: `node --version` (should be >= 18.0.0)

### Client can't connect
- Verify the server is running
- Check that the client config matches the server host/port
- Ensure WebSockets are not blocked by firewall/proxy
- Check browser console for connection errors

### Build fails
- Ensure RequireJS optimizer (`r.js`) is available in `bin/`
- Check that `client/js/build.js` exists
- Verify all client dependencies are present

## Modernization Notes (2026 Update)

This version has been modernized with:

- ✅ Modern WebSocket library (`ws` instead of deprecated packages)
- ✅ Updated dependencies (Node.js 18+, modern npm)
- ✅ Removed deprecated packages (bison, old websocket libraries)
- ✅ Simplified logging (replaced deprecated `log` package)
- ✅ Environment variable support for configuration
- ✅ Modern npm scripts
- ✅ Improved error handling
- ✅ Updated documentation

## License

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.

## Credits

Originally created by [Little Workshop](http://www.littleworkshop.fr):
- Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
- Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)

Modernized for 2026.
