#!/usr/bin/env node

import { startServer } from './core/server.js';

// Start the MCP server
startServer().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 