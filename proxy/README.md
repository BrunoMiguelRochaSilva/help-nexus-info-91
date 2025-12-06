# Rare Help Proxy Server

AI-powered proxy server for rare disease information using Ollama and Orphadata.

## Architecture

This production-ready Node.js/TypeScript proxy server:

- **Queries Orphadata API** for rare disease information
- **Falls back to local Ollama** (Gemma model) for AI-generated responses
- **Tracks user interactions** in a PostgreSQL database (Supabase)
- **Streams AI responses** via Server-Sent Events (SSE)
- **Runs containerized** with Docker Desktop

## Tech Stack

- **Backend**: Node.js 22+ with TypeScript
- **AI Engine**: Ollama with Gemma model
- **Database**: PostgreSQL (Supabase)
- **Containerization**: Docker Desktop with Docker Compose
- **Security**: CORS, rate limiting, input validation, Helmet.js
- **Logging**: Winston

## Prerequisites

- Docker Desktop installed and running
- Node.js 22+ (for local development)
- Supabase account with database deployed (schema provided in project spec)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd help-nexus-info-main
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Server
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b

# Supabase (REQUIRED - Get from your Supabase dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Orphadata
ORPHADATA_API_URL=https://api.orphadata.com

# CORS (Add your frontend domains)
CORS_ORIGINS=http://localhost:3000,https://your-website.com
```

### 3. Start Services with Docker

```bash
# Build and start containers
docker-compose up -d

# Pull the Ollama Gemma model (required, ~1.7GB download)
docker exec ollama-server ollama pull gemma:2b

# Check logs
docker-compose logs -f
```

### 4. Verify Health

```bash
curl http://localhost:3001/status
```

Expected response:
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

## API Endpoints

### GET /status

Health check for all services.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-18T12:00:00.000Z",
  "services": {
    "ollama": "up",
    "database": "up"
  }
}
```

---

### GET /api/orpha/:term

Search Orphadata for rare diseases.

**Example:**
```bash
curl http://localhost:3001/api/orpha/albinism
```

**Response:**
```json
{
  "orphacode": "55",
  "name": "Oculocutaneous albinism",
  "description": "A group of genetic conditions...",
  "synonyms": ["OCA", "Albinism"]
}
```

**Error Response (404):**
```json
{
  "error": "Disease not found",
  "suggestion": "Try using the AI chat for more information"
}
```

---

### POST /chat

Chat with AI about rare diseases (SSE streaming).

**Request:**
```bash
curl -N -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is hemophilia?",
    "history": [],
    "userId": "uuid-optional",
    "anonymousId": "anon-id-optional"
  }'
```

**Request Body Schema:**
```typescript
{
  message: string;        // Required, 1-5000 characters
  history?: Array<{       // Optional conversation history
    role: 'user' | 'assistant';
    content: string;
  }>;
  userId?: string;        // Optional UUID for authenticated users
  anonymousId?: string;   // Optional ID for anonymous users
}
```

**Response (Server-Sent Events):**
```
data: {"content":"Hemophilia","done":false}

data: {"content":" is a","done":false}

data: {"content":" genetic disorder...","done":false}

data: {"content":"","done":true}
```

**Rate Limiting:**
- 100 requests per minute per identifier (userId, anonymousId, or IP)
- Tracked in Supabase `rate_limits` table

---

## Local Development

### Without Docker

```bash
# Install dependencies
npm install

# Start Ollama separately (macOS/Linux)
ollama serve
ollama pull gemma:2b

# Start development server with hot reload
npm run dev
```

### With Docker (Recommended)

```bash
# Start in development mode (hot reload enabled)
docker-compose up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

## Production Deployment

### Build and Deploy

```bash
# Build TypeScript
npm run build

# Start production server
NODE_ENV=production npm start
```

### Docker Production

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker-compose ps
```

## Project Structure

```
help-nexus-info-main/
├── src/
│   ├── server.ts              # Main Express server
│   ├── config/
│   │   ├── database.ts        # Supabase client config
│   │   └── env.ts             # Environment validation (Zod)
│   ├── routes/
│   │   ├── health.ts          # GET /status
│   │   ├── orpha.ts           # GET /api/orpha/:term
│   │   └── chat.ts            # POST /chat (SSE)
│   ├── services/
│   │   ├── OllamaService.ts   # Ollama AI integration
│   │   ├── OrphadataService.ts # Orphadata API client
│   │   └── DatabaseService.ts # Supabase operations
│   ├── middleware/
│   │   ├── cors.ts            # CORS configuration
│   │   ├── rateLimit.ts       # Rate limiting (DB-backed)
│   │   ├── errorHandler.ts    # Global error handler
│   │   └── validator.ts       # Input validation (Zod)
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── utils/
│       └── logger.ts          # Winston logger
├── docker/
│   └── Dockerfile.proxy       # Proxy server Dockerfile
├── docker-compose.yml         # Docker orchestration
├── package.json
├── tsconfig.json
└── README.md
```

## Monitoring & Debugging

### View Logs

```bash
# All services
docker-compose logs -f

# Proxy only
docker-compose logs -f proxy

# Ollama only
docker-compose logs -f ollama
```

### Check Ollama Status

```bash
# List installed models
docker exec ollama-server ollama list

# Check if Gemma is loaded
docker exec ollama-server ollama show gemma:2b
```

### Database Queries

```bash
# Connect to Supabase and check interactions
# (Use Supabase dashboard or SQL editor)
SELECT * FROM interactions ORDER BY created_at DESC LIMIT 10;
```

## Troubleshooting

### Ollama not responding

**Symptoms:** `/status` shows `ollama: "down"`

**Solutions:**
1. Ensure model is pulled:
   ```bash
   docker exec ollama-server ollama pull gemma:2b
   ```
2. Check memory: Gemma:2b needs ~4GB RAM
3. Restart Ollama container:
   ```bash
   docker-compose restart ollama
   ```

### Database errors

**Symptoms:** `/status` shows `database: "down"`

**Solutions:**
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
2. Check Supabase dashboard for table structure
3. Ensure all tables exist (profiles, interactions, rate_limits, etc.)
4. Check Supabase service status

### CORS errors

**Symptoms:** Browser console shows CORS errors

**Solutions:**
1. Add your frontend domain to `CORS_ORIGINS` in `.env`:
   ```env
   CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
   ```
2. Restart proxy server:
   ```bash
   docker-compose restart proxy
   ```

### Rate limit issues

**Symptoms:** 429 errors "Rate limit exceeded"

**Solutions:**
1. Check `rate_limits` table in Supabase
2. Increase limits in `src/middleware/rateLimit.ts`
3. Clear rate limits:
   ```sql
   DELETE FROM rate_limits WHERE identifier = 'your-identifier';
   ```

### Streaming not working

**Symptoms:** Chat responses don't stream

**Solutions:**
1. Ensure client accepts `text/event-stream`:
   ```bash
   curl -N -H "Accept: text/event-stream" ...
   ```
2. Check Ollama is responding:
   ```bash
   docker exec ollama-server ollama run gemma:2b "Hello"
   ```

## Testing

### Manual Testing

```bash
# 1. Health check
curl http://localhost:3001/status

# 2. Orphadata search
curl http://localhost:3001/api/orpha/albinism

# 3. Chat (non-streaming)
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Ehlers-Danlos syndrome?",
    "anonymousId": "test-user-123"
  }'

# 4. Chat with SSE (streaming)
curl -N -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "message": "Tell me about cystic fibrosis",
    "anonymousId": "test-user-456"
  }'
```

### Expected Results

1. **Health check**: Returns 200 with all services "up"
2. **Orphadata**: Returns disease info or 404
3. **Chat**: Returns SSE stream with AI response
4. **Database**: Check Supabase `interactions` table for saved records

## Security Features

- **Helmet.js**: Security headers (CSP, XSS protection, etc.)
- **CORS**: Origin whitelist validation
- **Rate Limiting**: 100 req/min per identifier (database-backed)
- **Input Validation**: Zod schema validation for all requests
- **Error Handling**: No stack traces in production
- **Logging**: All requests and errors logged with Winston

## Performance Considerations

- **Ollama Model**: Gemma:2b requires ~4GB RAM
- **Database**: Connection pooling via Supabase client
- **Streaming**: SSE reduces memory usage for long responses
- **Docker**: Alpine Linux images for smaller size

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3001` | Server port |
| `OLLAMA_API_URL` | Yes | - | Ollama API endpoint |
| `OLLAMA_MODEL` | No | `gemma:2b` | Ollama model name |
| `OLLAMA_TEMPERATURE` | No | `0.7` | AI temperature (0-1) |
| `OLLAMA_MAX_TOKENS` | No | `2048` | Max response tokens |
| `SUPABASE_URL` | Yes | - | Supabase project URL |
| `SUPABASE_KEY` | Yes | - | Supabase anon key |
| `ORPHADATA_API_URL` | Yes | - | Orphadata API endpoint |
| `CORS_ORIGINS` | Yes | - | Comma-separated allowed origins |
| `LOG_LEVEL` | No | `info` | Winston log level |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
