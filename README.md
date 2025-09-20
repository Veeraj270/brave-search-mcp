# Anthropic MCP Server

An MCP server implementation that integrates with the Anthropic API, providing Claude with web search capabilities through a single, easy-to-use tool.

## Features

- **Anthropic Integration**: Direct integration with Claude via the Anthropic API
- **Web Search**: Claude can search the web for current information using the built-in web search tool
- **Single Tool Interface**: Simple `anthropic_claude` tool that accepts any prompt
- **Flexible Transport**: Supports both STDIO and HTTP transports
- **Production Ready**: Includes Docker support and proper error handling

## Tools

- **anthropic_claude**
  - Sends prompts to Claude with web search capabilities
  - Inputs:
    - `prompt` (string): The prompt or question to send to Claude
    - `maxTokens` (number, optional): Maximum tokens to generate (default: 16384, max: 16384)

## Configuration

### Getting an API Key

1. Sign up for an [Anthropic API account](https://console.anthropic.com/)
2. Generate your API key from the dashboard
3. Set the `ANTHROPIC_API_KEY` environment variable

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

#### NPX

```json
{
  "mcpServers": {
    "anthropic-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "anthropic-mcp-server"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

#### Docker

```json
{
  "mcpServers": {
    "anthropic-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ANTHROPIC_API_KEY",
        "anthropic-mcp:latest"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Usage with VS Code

For quick installation, use the one-click installation buttons below...

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=anthropic&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apiKey%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22anthropic-mcp-server%22%5D%2C%22env%22%3A%7B%22ANTHROPIC_API_KEY%22%3A%22%24%7Binput%3Aanthropic_api_key%7D%22%7D%7D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=anthropic&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apiKey%22%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22anthropic-mcp-server%22%5D%2C%22env%22%3A%7B%22ANTHROPIC_API_KEY%22%3A%22%24%7Binput%3Aanthropic_api_key%7D%22%7D%7D&quality=insiders)

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
        "id": "anthropic_api_key",
        "description": "Anthropic API Key",
        "password": true
      }
    ],
    "servers": {
      "anthropic-mcp": {
        "command": "npx",
        "args": ["-y", "anthropic-mcp-server"],
        "env": {
          "ANTHROPIC_API_KEY": "${input:anthropic_api_key}"
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
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd anthropic-mcp-server

# Install dependencies
npm install

# Set your API key
export ANTHROPIC_API_KEY="your-api-key-here"
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

Once the server is running, you can use the `anthropic_claude` tool with any prompt:

```json
{
  "name": "anthropic_claude",
  "arguments": {
    "prompt": "What are the latest developments in AI?",
    "maxTokens": 4096
  }
}
```

Claude will automatically use web search when needed to provide up-to-date information.

## API Reference

### Tool: anthropic_claude

Sends a prompt to Claude with web search capabilities.

**Parameters:**
- `prompt` (string, required): The prompt or question to send to Claude
- `maxTokens` (number, optional): Maximum tokens to generate (default: 16384, max: 16384)

**Returns:**
- Claude's response as text, potentially including information gathered from web search

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.