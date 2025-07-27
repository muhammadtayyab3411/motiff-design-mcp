import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CONFIG } from '../utils/config.js';
import { 
    fetchDesignDescription, 
    fetchDesignHandler, 
    fetchDesignSchema 
} from '../tools/fetch-design.js';
import { 
    fetchPreviewDescription, 
    fetchPreviewHandler, 
    fetchPreviewSchema 
} from '../tools/fetch-preview.js';

export function createServer() {
    const server = new McpServer({
        name: CONFIG.serviceName,
        version: CONFIG.version,
        capabilities: {
            resources: {},
            tools: {},
        },
    });

    // Register design content fetching tool
    server.tool(
        'motiff_get_design',
        fetchDesignDescription,
        fetchDesignSchema,
        fetchDesignHandler
    );

    // Register design preview tool
    server.tool(
        'motiff_get_preview',
        fetchPreviewDescription,
        fetchPreviewSchema,
        fetchPreviewHandler
    );

    return server;
}

export async function startServer() {
    const server = createServer();
    const transport = new StdioServerTransport();
    
    await server.connect(transport);
    console.error(`${CONFIG.serviceName} running on stdio transport`);
} 