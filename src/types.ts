/**
 * Type definitions for API integration
 */

/**
 * Message tool arguments
 * @interface MessageArgs
 */
export interface MessageArgs {
    /** The user's prompt/message */
    prompt: string;
    /** Maximum tokens to generate (optional, default: 16384) */
    maxTokens?: number;
}
