import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { Client } from './client.js';
import {
    toolDefinition,
    handleTool
} from './tool.js';

/**
 * Main server class for MCP integration
 * @class McpServer
 */
export class McpServer {
    private client: Client;
    private server: Server;

    /**
     * Creates a new McpServer instance
     * @param {string} apiKey - API key for authentication
     */
    constructor(apiKey: string) {
        this.client = new Client(apiKey);
        this.server = new Server(
            {
                name: 'mcp-server',
                version: '0.1.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
        this.setupErrorHandling();
    }

    /**
     * Sets up MCP request handlers for tools
     * @private
     */
    private setupHandlers(): void {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [toolDefinition],
        }));

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            switch (name) {
                case 'ai_model':
                    return handleTool(this.client, args);
                
                default:
                    throw new McpError(
                        ErrorCode.MethodNotFound,
                        `Unknown tool: ${name}`
                    );
            }
        });
    }

    /**
     * Configures error handling and graceful shutdown
     * @private
     */
    private setupErrorHandling(): void {
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    /**
     * Returns the underlying MCP server instance
     * @returns {Server} MCP server instance
     */
    getServer(): Server {
        return this.server;
    }
}

/**
 * Factory function for creating standalone server instances
 * Used by HTTP transport for session-based connections
 * @param {string} apiKey - API key for authentication
 * @returns {Server} Configured MCP server instance
 */
export function createStandaloneServer(apiKey: string): Server {
    const server = new Server(
        {
            name: "mcp-discovery",
            version: "0.1.0",
        },
        {
            capabilities: {
                tools: {},
            },
        },
    );

    const client = new Client(apiKey);

    // Set up handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [toolDefinition],
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        switch (name) {
            case 'ai_model':
                return handleTool(client, args);
            
            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                );
        }
    });

    return server;
}