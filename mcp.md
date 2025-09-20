# MCP Server Documentation

## Overview

This guide walks you through setting up and running a Model Context Protocol (MCP) server that provides AI model integration with web search capabilities via Streamable HTTP transport. The server offers a single tool that allows you to send prompts to AI models and receive responses with web search capabilities.

## Prerequisites

### Required Software
- **Node.js 18+** - Install from [nodejs.org](https://nodejs.org/)
- **API Key** - Obtain from your API provider
- **Basic terminal/command line knowledge**

### System Requirements
- Node.js 18+ compatible environment
- Internet connection for API calls
- Available port (default: 3002)

## Installation & Setup

### 1. Project Setup
```bash
# Clone or download the mcp-server files
# Ensure you have these files:
# - index.ts (main server file)
# - package.json (dependencies)
# - tsconfig.json (TypeScript config)
```

### 2. Install Dependencies
```bash
# Navigate to the mcp-server directory
cd /path/to/mcp-server

# Install all required packages
npm install
```

**What this does:** Downloads the MCP SDK, AI SDK, and other dependencies needed to run the server.

### 3. API Key Configuration
```bash
# Option 1: Environment variable (recommended for production)
export API_KEY="your-api-key-here"

# Option 2: Create a .env file
echo "API_KEY=your-api-key-here" > .env
```

**Security Note:** Never commit API keys to version control. Use environment variables in production.

## Running the Server

### Starting the Server
```bash
# Start the server on port 3002 with HTTP transport
npm run dev:http

# Or start with STDIO transport for development
npm run dev:stdio
```

**Expected Output:**
```
MCP Server listening on http://localhost:3002
Put this in your client config:
{
  "mcpServers": {
    "mcp-server": {
      "url": "http://localhost:3002/mcp"
    }
  }
}
```

### Understanding the Endpoints

The server provides these endpoints:

1. **`/mcp`** - Streamable HTTP transport (recommended)
2. **`/health`** - Health check endpoint

## Testing the Server

### 1. Initialize MCP Session
```bash
curl -v -X POST http://localhost:3002/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {
        "tools": {}
      },
      "clientInfo": {
        "name": "TestClient",
        "version": "1.0.0"
      }
    }
  }'
```

**What to look for:**
- Status: `200 OK`
- Header: `mcp-session-id: [uuid]` (save this for next steps)
- Response: JSON with server capabilities

### 2. Send Initialized Notification
```bash
curl -X POST http://localhost:3002/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: YOUR_SESSION_ID_FROM_STEP_1" \
  -d '{
    "jsonrpc": "2.0",
    "method": "notifications/initialized"
  }'
```

**Critical:** Replace `YOUR_SESSION_ID_FROM_STEP_1` with the actual session ID from step 1.

### 3. List Available Tools
```bash
curl -X POST http://localhost:3002/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'
```

**Expected Response:** List of one tool:
- `ai_model` - Send prompts to AI models with web search

### 4. Use the AI Model Tool
```bash
curl -X POST http://localhost:3002/mcp \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "ai_model",
      "arguments": {
        "prompt": "What are the latest developments in AI?",
        "maxTokens": 4096
      }
    }
  }'
```

## Implementation Details

### What This Server Provides

The Anthropic MCP server provides a clean interface to Claude with web search capabilities:

1. **Single Tool Interface**: One tool (`anthropic_claude`) that accepts any prompt
2. **Web Search Integration**: Claude automatically uses web search when needed
3. **Flexible Configuration**: Configurable token limits and other parameters
4. **Production Ready**: HTTP transport with session management

### Key Features

#### 1. Anthropic Integration
```typescript
// Uses the official Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: apiKey,
});
```

#### 2. Web Search Tool
```typescript
// Claude has access to web search
tools: [{
    type: "web_search",
    name: "web_search",
    max_uses: 2
}]
```

#### 3. Session Management
```typescript
// Each client connection gets its own server instance
const streamableSessions = new Map<string, {transport: any, server: any}>();
```

### Transport Comparison

| Feature | STDIO Transport | Streamable HTTP Transport |
|---------|----------------|---------------------------|
| Use Case | CLI applications | Web services, production |
| Concurrency | Single client | Multiple concurrent clients |
| State Management | Process-based | Session-based |
| Production | ❌ Not suitable | ✅ Fully supported |
| Web Browser | ❌ Not possible | ✅ Direct integration |
| Debugging | Simple | Requires HTTP tools |

## Understanding MCP Concepts

### Session Management
- Each client connection gets a unique session ID
- Sessions maintain state between requests
- Sessions are automatically cleaned up when connections close
- **Important:** Always include the `Mcp-Session-Id` header after initialization

### Transport Types
1. **Streamable HTTP** (`/mcp`): Modern, efficient, supports streaming responses
2. **STDIO**: For local development and debugging

### Message Flow
1. **Initialize** - Establish capabilities and protocol version
2. **Initialized** - Confirm initialization complete
3. **Tools/List** - Discover available tools
4. **Tools/Call** - Execute tool functions

## Common Issues & Troubleshooting

### "Server not initialized" Error
**Cause:** Missing or incorrect session ID  
**Solution:** Ensure you're using the session ID from the initialization response

### "Session not found" Error
**Cause:** Session expired or invalid session ID  
**Solution:** Re-initialize with a new session

### Port Already in Use
**Cause:** Another process is using port 3002  
**Solution:** 
```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9

# Or use a different port
npm run dev:http -- --port 3003
```

### API Rate Limiting
**Cause:** Exceeded Anthropic API limits  
**Solution:** Check your Anthropic API usage and billing

### Connection Timeout
**Cause:** Network issues or server overload  
**Solution:** Check network connectivity and server resources

## Production Deployment

### Environment Variables
```bash
export ANTHROPIC_API_KEY="your-production-api-key"
export PORT="3002"
export NODE_ENV="production"
```

### Process Management
```bash
# Using PM2 for process management
npm install -g pm2
pm2 start "npm run start" --name anthropic-mcp
```

### Docker Deployment
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["node", "dist/index.js", "--port", "3002"]
```

### AWS Lambda Deployment
The server supports Streamable HTTP, making it suitable for serverless deployment:
- Configure API Gateway to proxy requests to `/mcp`
- Set appropriate timeout values (30s+)
- Handle cold starts gracefully

## Security Best Practices

### API Key Security
- Use environment variables, never hardcode keys
- Rotate API keys regularly
- Monitor API usage and set alerts

### Network Security
- Bind to localhost (`127.0.0.1`) for local development
- Use HTTPS in production
- Implement proper authentication for public deployments

### Input Validation
- The server validates JSON-RPC message format
- Prompts are processed by Anthropic's safety systems
- Token limits are enforced

## Monitoring & Logging

### Built-in Logging
The server logs:
- Session creation/destruction
- API errors and responses
- Connection events

### Health Checks
```bash
# Simple health check
curl -f http://localhost:3002/health || echo "Server down"
```

### Metrics to Monitor
- Active session count
- API call frequency
- Response times
- Error rates
- Memory usage

## Advanced Configuration

### Custom Token Limits
```typescript
// Adjust in anthropic-tool.ts if needed
const { prompt, maxTokens = 16384 } = args;
```

### Timeout Configuration
```typescript
// Adjust in createServerInstance() if needed
const serverInstance = new Server({
  name: "anthropic-mcp",
  version: "0.1.0"
}, {
  capabilities: { tools: {} },
  // Add timeout configs here
});
```

## Support & Further Reading

- [MCP Specification](https://modelcontextprotocol.io/specification/draft/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

This server is now ready for production use and can handle multiple concurrent connections efficiently while providing reliable Anthropic Claude functionality through the MCP protocol.