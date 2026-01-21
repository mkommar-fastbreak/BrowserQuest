# Deploying BrowserQuest to Vercel

BrowserQuest consists of two parts:
1. **Client** (static files) - Can be deployed to Vercel
2. **Server** (WebSocket server) - Must be deployed to a platform that supports persistent WebSocket connections

## Quick Deploy to Vercel (Client Only)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts and deploy.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `echo 'Static files - no build needed'`
   - **Install Command**: `echo 'No install needed' || true`
   - **Output Directory**: `client`

## Configuration

### Option 1: Edit config_build.json (Recommended)

Before deploying, edit `client/config/config_build.json`:

```json
{
  "host": "your-server-host.railway.app",
  "port": 8000
}
```

### Option 2: Use Runtime Config

Edit `client/config.js` to set your server URL, or inject it via a build script.

## Deploying the Server

Vercel's serverless functions don't support persistent WebSocket connections. Deploy the server to one of these platforms:

### Option 1: Railway (Recommended)

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and create a new project:
   ```bash
   railway login
   railway init
   ```

3. Deploy:
   ```bash
   railway up
   ```

4. Set environment variables in Railway dashboard:
   - `PORT` (Railway will set this automatically)
   - `BROWSERQUEST_DEBUG_LEVEL=info`
   - `BROWSERQUEST_NB_WORLDS=5`
   - `BROWSERQUEST_PLAYERS_PER_WORLD=200`

5. Get your Railway URL and update Vercel environment variables.

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/js/main.js`
   - **Environment**: Node
5. Add environment variables
6. Deploy

### Option 3: Fly.io

1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Create `fly.toml`:
   ```toml
   app = "browserquest-server"
   primary_region = "iad"

   [build]

   [env]
     PORT = "8000"

   [[services]]
     internal_port = 8000
     protocol = "tcp"

     [[services.ports]]
       port = 80
       handlers = ["http"]
       force_https = true

     [[services.ports]]
       port = 443
       handlers = ["tls", "http"]
   ```

3. Deploy:
   ```bash
   fly launch
   fly deploy
   ```

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create a new app from GitHub
3. Configure as a Web Service
4. Set start command: `node server/js/main.js`
5. Deploy

## Complete Setup

1. **Deploy Server** to Railway/Render/Fly.io
2. **Get Server URL** (e.g., `https://browserquest-server.railway.app`)
3. **Deploy Client** to Vercel
4. **Set Environment Variables** in Vercel:
   - `BROWSERQUEST_SERVER_HOST=browserquest-server.railway.app`
   - `BROWSERQUEST_SERVER_PORT=8000`
5. **Update Client Config** (optional):
   Edit `client/config/config_build.json`:
   ```json
   {
     "host": "browserquest-server.railway.app",
     "port": 8000
   }
   ```

## Testing Locally

1. Start the server:
   ```bash
   npm start
   ```

2. Serve the client:
   ```bash
   cd client
   python3 -m http.server 8080
   ```

3. Open `http://localhost:8080` in your browser

## Troubleshooting

### WebSocket Connection Failed
- Ensure the server is running and accessible
- Check CORS settings on the server
- Verify the server URL in client config matches your deployed server

### Client Not Loading
- Check Vercel build logs
- Ensure all static assets are in the `client` directory
- Verify `vercel.json` configuration

### Server Connection Issues
- Check server logs
- Verify environment variables are set correctly
- Ensure the server port is exposed and accessible

## Notes

- The client is served as static files from Vercel
- The server must run on a platform that supports WebSockets
- WebSocket connections require persistent connections (not serverless)
- Consider using a service like Railway, Render, or Fly.io for the server
