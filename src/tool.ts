import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Client } from './client.js';
import { MessageArgs } from './types.js';

/**
 * Tool definition for AI model with web search
 */
export const toolDefinition: Tool = {
    name: "ai_model",
    description:
        "Sends a prompt to an AI model with web search capabilities. " +
        "The model can search the web for current information and provide comprehensive, " +
        "up-to-date responses. Use this for any question that might benefit from " +
        "real-time information or when you need AI reasoning capabilities " +
        "combined with web search.",
    inputSchema: {
        type: "object",
        properties: {
            prompt: {
                type: "string",
                description: "The prompt or question to send to Claude"
            },
            maxTokens: {
                type: "number",
                description: "Maximum tokens to generate (default: 16384, max: 16384)",
                default: 16384,
                minimum: 1,
                maximum: 16384
            }
        },
        required: ["prompt"]
    }
};

/**
 * Type guard for message arguments
 * @param {unknown} args - Arguments to validate
 * @returns {boolean} True if arguments are valid
 */
function isMessageArgs(args: unknown): args is MessageArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "prompt" in args &&
        typeof (args as { prompt: string }).prompt === "string"
    );
}

/**
 * Handles tool calls
 * @param {Client} client - API client instance
 * @param {unknown} args - Tool call arguments
 * @returns {Promise<CallToolResult>} Tool call result
 */
export async function handleTool(client: Client, args: unknown): Promise<CallToolResult> {
    try {
        if (!args) {
            throw new Error("No arguments provided");
        }

        if (!isMessageArgs(args)) {
            throw new Error("Invalid arguments for ai_model");
        }

        const { prompt, maxTokens = 16384 } = args;
        const response = await client.sendMessage(prompt, maxTokens);
        
        return {
            content: [{ type: "text", text: response }],
            isError: false,
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
}
