# Motiff Design MCP

A Model Context Protocol (MCP) server for integrating Motiff designs with AI-powered IDEs like Cursor. This MCP enables seamless conversion of Motiff designs into code by providing structured access to design content and previews.

## Features

- 🎨 **Design Content Fetching**: Get complete HTML representation of Motiff designs with all styling intact
- 🖼️ **Design Previews**: Generate preview images of designs for visual reference
- 🔄 **Task-based Processing**: Reliable handling of design content generation through task-based architecture
- 🔐 **Authentication**: Secure access through Motiff API tokens
- ⚡ **Performance**: Optimized for quick response times and efficient processing

## Installation

```bash
# Using npm
npm install -g @motiff/designmcp

# Using yarn
yarn global add @motiff/designmcp
```

## Configuration

The MCP server requires a Motiff API token for authentication. Set it using the environment variable:

```bash
export MOTIFF_TOKEN="your_motiff_token"
```

Optional configuration:
```bash
# Custom API endpoint (defaults to https://api.motiff.com)
export MOTIFF_HOST="https://your-custom-endpoint.com"
```

## Usage

### In Cursor

1. Paste a Motiff design URL in Cursor's chat:
```
https://motiff.com/file/{docId}?nodeId={nodeId}&type=design
```

2. The MCP server will automatically:
   - Fetch the design content
   - Generate a preview
   - Provide the content to Cursor for code generation

### Available Tools

#### `motiff_get_design`
Fetches the complete HTML representation of a design node.

Parameters:
- `docId`: The document ID from the Motiff URL
- `nodeId`: The specific node ID to fetch
- `debug` (optional): Enable debug mode

#### `motiff_get_preview`
Gets a preview image of the design node.

Parameters:
- `docId`: The document ID from the Motiff URL
- `nodeId`: The specific node ID to fetch

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/motiff-mcp-server
cd motiff-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. For development with watch mode:
```bash
npm run dev
```

## API Response Format

### Design Content Response
```typescript
interface DesignResponse {
  content: Array<{
    type: 'text';
    text: string;  // HTML content
  }>;
  isError?: boolean;
}
```

### Preview Response
```typescript
interface PreviewResponse {
  content: Array<{
    type: 'image';
    data: string;  // Base64 encoded image
    mimeType: string;
  }>;
  isError?: boolean;
}
```

## Error Handling

The MCP server provides detailed error messages for common issues:

- Authentication errors (invalid or missing token)
- Invalid document or node IDs
- Network connectivity issues
- Task processing failures

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Muhammad Tayyab**
- Website: https://www.iamtayyab.com
- Email: meetayyab@gmail.com

## Support

For support, please create an issue in the GitHub repository or contact the author directly. 