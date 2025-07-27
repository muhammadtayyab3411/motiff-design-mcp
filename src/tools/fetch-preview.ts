import { z } from 'zod';
import { fetchDesignPreview } from '../core/design-service.js';
import { CONFIG } from '../utils/config.js';

const paramsSchema = {
    docId: z.string(),
    nodeId: z.string(),
} as const;

export const fetchPreviewSchema = paramsSchema;

export const fetchPreviewDescription = `
Get a preview image of a design from Motiff Design System. Returns a base64 encoded image.
The design can be accessed via URL: ${CONFIG.apiEndpoint}/file/{docId}?nodeId={nodeId}&type=design

Use this tool to:
1. View design mockups
2. Share visual references
3. Compare design iterations
`;

type Params = {
    docId: string;
    nodeId: string;
};

export async function fetchPreviewHandler(args: Params) {
    try {
        const { data, format } = await fetchDesignPreview(args.docId, args.nodeId);
        return {
            content: [{
                type: 'image' as const,
                data: data,
                mimeType: format,
            }],
        };
    } catch (error) {
        return {
            content: [{ 
                type: 'text' as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}` 
            }],
            isError: true,
        };
    }
} 