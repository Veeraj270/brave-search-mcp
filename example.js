#!/usr/bin/env node

/**
 * Example script demonstrating how to use the Anthropic MCP Server
 * 
 * This script shows how to:
 * 1. Initialize an MCP session
 * 2. List available tools
 * 3. Call the anthropic_claude tool
 */

import { createStandaloneServer } from './dist/server.js';

async function example() {
    // Check if API key is provided
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error('Please set ANTHROPIC_API_KEY environment variable');
        process.exit(1);
    }

    console.log('🚀 Starting Anthropic MCP Server Example...\n');

    try {
        // Create a server instance
        const server = createStandaloneServer(apiKey);
        
        // Example 1: List available tools
        console.log('📋 Available tools:');
        const toolsResponse = await server.request({
            method: 'tools/list',
            params: {}
        });
        
        console.log(JSON.stringify(toolsResponse, null, 2));
        console.log('\n');

        // Example 2: Call the anthropic_claude tool
        console.log('🤖 Calling anthropic_claude tool...');
        const toolResponse = await server.request({
            method: 'tools/call',
            params: {
                name: 'anthropic_claude',
                arguments: {
                    prompt: 'What are the latest developments in AI? Please provide a brief summary.',
                    maxTokens: 1000
                }
            }
        });

        console.log('📝 Claude\'s response:');
        console.log(toolResponse.content[0].text);
        console.log('\n');

        // Example 3: Another call with a different prompt
        console.log('🔍 Asking Claude to search for current news...');
        const newsResponse = await server.request({
            method: 'tools/call',
            params: {
                name: 'anthropic_claude',
                arguments: {
                    prompt: 'What are the top 3 technology news stories today?',
                    maxTokens: 1500
                }
            }
        });

        console.log('📰 Current news from Claude:');
        console.log(newsResponse.content[0].text);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the example
example();
