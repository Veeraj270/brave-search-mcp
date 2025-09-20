import Anthropic from '@anthropic-ai/sdk';

/**
 * Client for interacting with the API
 * @class Client
 */
export class Client {
    private readonly client: Anthropic;

    /**
     * Creates a new Client instance
     * @param {string} apiKey - API key for authentication
     */
    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('API key is required');
        }
        this.client = new Anthropic({
            apiKey: apiKey,
        });
    }

    /**
     * Sends a message to Claude with web search capabilities
     * @param {string} prompt - The user's prompt/message
     * @param {number} maxTokens - Maximum tokens to generate (default: 16384)
     * @returns {Promise<string>} Claude's response
     */
    async sendMessage(prompt: string, maxTokens: number = 16384): Promise<string> {
        try {
            const response = await this.client.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: maxTokens,
                tools: [{
                    type: "web_search",
                    name: "web_search",
                    max_uses: 2
                }],
                messages: [{
                    role: "user",
                    content: prompt
                }]
            });

            // Extract the text content from the response
            if (response.content && response.content.length > 0) {
                const textContent = response.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join('\n');
                
                return textContent || 'No response generated';
            }

            return 'No response generated';
        } catch (error) {
            throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
