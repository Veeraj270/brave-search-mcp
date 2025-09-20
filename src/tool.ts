import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AnthropicClient } from './anthropic-client.js';
import { AnthropicMessageArgs } from './anthropic-types.js';

/**
 * Tool definition for Anthropic Claude with web search
 */
export const anthropicToolDefinition: Tool = {
    name: "anthropic_claude",
    description:
        "Sends a prompt to Claude (Anthropic's AI model) with web search capabilities. " +
        "Claude can search the web for current information and provide comprehensive, " +
        "up-to-date responses. Use this for any question that might benefit from " +
        "real-time information or when you need Claude's reasoning capabilities " +
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
 * Type guard for Anthropic message arguments
 * @param {unknown} args - Arguments to validate
 * @returns {boolean} True if arguments are valid
 */
function isAnthropicMessageArgs(args: unknown): args is AnthropicMessageArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "prompt" in args &&
        typeof (args as { prompt: string }).prompt === "string"
    );
}

/**
 * Handles Anthropic tool calls
 * @param {AnthropicClient} client - Anthropic API client instance
 * @param {unknown} args - Tool call arguments
 * @returns {Promise<CallToolResult>} Tool call result
 */
export async function handleAnthropicTool(client: AnthropicClient, args: unknown): Promise<CallToolResult> {
    try {
        if (!args) {
            throw new Error("No arguments provided");
        }

        if (!isAnthropicMessageArgs(args)) {
            throw new Error("Invalid arguments for anthropic_claude");
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
