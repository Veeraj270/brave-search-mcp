# MCP Server

An MCP server implementation that integrates with AI APIs, providing web search capabilities through a single, easy-to-use tool.

## Features

- **AI Integration**: Direct integration with AI models via API
- **Web Search**: AI models can search the web for current information using the built-in web search tool
- **Single Tool Interface**: Simple `ai_model` tool that accepts any prompt
- **Flexible Transport**: Supports both STDIO and HTTP transports
- **Production Ready**: Includes Docker support and proper error handling

## Tools

- **ai_model**
  - Sends prompts to AI models with web search capabilities
  - Inputs:
    - `prompt` (string): The prompt or question to send to the AI model
    - `maxTokens` (number, optional): Maximum tokens to generate (default: 16384, max: 16384)

## Configuration

### Getting an API Key

1. Sign up for an API account
2. Generate your API key from the dashboard
3. Set the `API_KEY` environment variable

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

#### NPX

```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server"
      ],
      "env": {
        "API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

#### Docker

```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "API_KEY",
        "mcp-server:latest"
      ],
      "env": {
        "API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Usage with VS Code

For quick installation, use the one-click installation buttons below...

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=mcp&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apiKey%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-server%22%5D%2C%22env%22%3A%7B%22API_KEY%22%3A%22%24%7Binput%3Aapi_key%7D%22%7D%7D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=mcp&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apiKey%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22mcp-server%22%5D%2C%22env%22%3A%7B%22API_KEY%22%3A%22%24%7Binput%3Aapi_key%7D%22%7D%7D&quality=insiders)

For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing `Ctrl + Shift + P` and typing `Preferences: Open User Settings (JSON)`.

Optionally, you can add it to a file called `.vscode/mcp.json` in your workspace. This will allow you to share the configuration with others.

> Note that the `mcp` key is not needed in the `.vscode/mcp.json` file.

#### NPX

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "api_key",
        "description": "API Key",
        "password": true
      }
    ],
    "servers": {
      "mcp-server": {
        "command": "npx",
        "args": ["-y", "mcp-server"],
        "env": {
          "API_KEY": "${input:api_key}"
        }
      }
    }
  }
}
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-server

# Install dependencies
npm install

# Set your API key
export API_KEY="your-api-key-here"
```

### Running the Server

#### STDIO Mode (for development)

```bash
npm run dev:stdio
```

#### HTTP Mode

```bash
npm run dev:http
# or
npm start
```

### Building

```bash
npm run build
```

## Example Usage

Once the server is running, you can use the `ai_model` tool with any prompt:

```json
{
  "name": "ai_model",
  "arguments": {
    "prompt": "What are the latest developments in AI?",
    "maxTokens": 4096
  }
}
```

The AI model will automatically use web search when needed to provide up-to-date information.

## API Reference

### Tool: ai_model

Sends a prompt to an AI model with web search capabilities.

**Parameters:**
- `prompt` (string, required): The prompt or question to send to the AI model
- `maxTokens` (number, optional): Maximum tokens to generate (default: 16384, max: 16384)

**Returns:**
- AI model's response as text, potentially including information gathered from web search

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.