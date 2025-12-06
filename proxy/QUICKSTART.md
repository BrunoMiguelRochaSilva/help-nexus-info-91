# Quick Start Guide - Rare Help Proxy Server

## Prerequisites Checklist

- [ ] Docker Desktop installed and running
- [ ] Node.js 22+ installed (optional, for local dev)
- [ ] Supabase credentials (already configured in `.env`)
- [ ] At least 6GB free RAM (4GB for Ollama Gemma model)

## Step-by-Step Setup

### Step 1: Start Docker Services

```bash
# Build and start containers
docker-compose up -d

# This will start:
# - Ollama server on port 11434
# - Proxy server on port 3001
```

**Expected Output:**
```
[+] Running 3/3
 ✔ Network help-nexus-info-main_default    Created
 ✔ Container ollama-server                 Started
 ✔ Container proxy-server                  Started
```

### Step 2: Pull Ollama Model

```bash
# Pull Gemma 2B model (~1.7GB download)
docker exec ollama-server ollama pull gemma:2b
```

**This will take 2-5 minutes depending on your internet speed.**

**Expected Output:**
```
pulling manifest
pulling 8ccb13a9d7c3... 100%
pulling ca82ad0a...     100%
verifying sha256 digest
writing manifest
success
```

### Step 3: Verify Services

```bash
# Check if all services are healthy
curl http://localhost:3001/status
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-18T...",
  "services": {
    "ollama": "up",
    "database": "up"
  }
}
```

### Step 4: Test Endpoints

#### Test Orphadata Search

```bash
curl http://localhost:3001/api/orpha/albinism
```

#### Test AI Chat

```bash
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is hemophilia?",
    "anonymousId": "test-user-123"
  }'
```

#### Test Streaming Chat

```bash
curl -N -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "message": "Tell me about cystic fibrosis",
    "anonymousId": "test-user-456"
  }'
```

### Step 5: Monitor Logs

```bash
# View all logs
docker-compose logs -f

# View proxy logs only
docker-compose logs -f proxy

# View Ollama logs only
docker-compose logs -f ollama
```

## Troubleshooting

### Issue: Ollama shows "down" in health check

**Solution:**
```bash
# Restart Ollama container
docker-compose restart ollama

# Wait 30 seconds, then check again
curl http://localhost:3001/status
```

### Issue: Database shows "down"

**Solution:**
1. Verify `.env` has correct Supabase credentials
2. Check Supabase dashboard is accessible
3. Verify internet connection

### Issue: "Model not found" error

**Solution:**
```bash
# Ensure model is pulled
docker exec ollama-server ollama list

# If gemma:2b is not listed, pull it again
docker exec ollama-server ollama pull gemma:2b
```

### Issue: Port already in use

**Solution:**
```bash
# Stop existing containers
docker-compose down

# Change PORT in .env if needed
PORT=3002

# Restart
docker-compose up -d
```

## Local Development (Without Docker)

If you want to run locally for development:

### 1. Install Ollama Locally

**macOS/Linux:**
```bash
curl https://ollama.ai/install.sh | sh
ollama serve
ollama pull gemma:2b
```

**Windows:**
- Download from https://ollama.ai
- Run installer
- Open terminal and run `ollama pull gemma:2b`

### 2. Update .env

```env
OLLAMA_API_URL=http://localhost:11434
```

### 3. Start Development Server

```bash
npm install
npm run dev
```

## Next Steps

1. **Integrate with Frontend**: Use the `/chat` endpoint with SSE in your React/Vue app
2. **Monitor Database**: Check Supabase dashboard for saved interactions
3. **Adjust Rate Limits**: Modify limits in `src/middleware/rateLimit.ts`
4. **Add Custom Prompts**: Enhance AI responses in `src/services/OllamaService.ts`
5. **Deploy to Production**: Use Docker Compose on cloud hosting (AWS, GCP, Azure)

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/status` | GET | Health check |
| `/api/orpha/:term` | GET | Search Orphadata |
| `/chat` | POST | AI chat (SSE streaming) |

## Architecture Flow

```
User Request
    ↓
Express Server (Port 3001)
    ↓
┌─────────────────────────┐
│   Is it Orphadata?      │
│   /api/orpha/:term      │
└─────────────────────────┘
    ↓                 ↓
   Yes               No
    ↓                 ↓
Orphadata API    Ollama (Gemma)
    ↓                 ↓
Database Save ← Response
    ↓
User receives response (SSE stream)
```

## Environment Variables

All configured in `.env`:

- `SUPABASE_URL`: ✅ Already set
- `SUPABASE_KEY`: ✅ Already set
- `OLLAMA_API_URL`: ✅ Already set
- `CORS_ORIGINS`: ⚠️ Add your frontend URL before production

## Security Checklist

- [x] CORS configured
- [x] Rate limiting active (100 req/min)
- [x] Input validation with Zod
- [x] Helmet.js security headers
- [x] Environment variables protected
- [ ] Add your frontend domain to CORS_ORIGINS
- [ ] Use HTTPS in production

## Performance Tips

1. **Ollama Memory**: Gemma:2b uses ~4GB RAM. For larger models, allocate more memory to Docker
2. **Database Pooling**: Supabase handles this automatically
3. **Streaming**: SSE reduces memory usage for long responses
4. **Caching**: Consider adding Redis for frequently asked questions

## Support

- Check logs: `docker-compose logs -f`
- Test endpoints: `bash test-endpoints.sh`
- View README.md for detailed documentation
- Check Supabase dashboard for database issues
