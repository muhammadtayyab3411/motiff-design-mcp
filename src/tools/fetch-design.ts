import { z } from 'zod';
import { fetchDesignHtml } from '../core/design-service.js';
import { CONFIG } from '../utils/config.js';

const paramsSchema = {
    docId: z.string(),
    nodeId: z.string(),
    debug: z.boolean().optional().default(false),
} as const;

export const fetchDesignSchema = paramsSchema;

export const fetchDesignDescription = `
Get design content from Motiff Design System. Returns complete HTML with styling that represents the design.
The design can be accessed via URL: ${CONFIG.apiEndpoint}/file/{docId}?nodeId={nodeId}&type=design

IMPLEMENTATION GUIDELINES:
1. Maintain exact visual fidelity - preserve all styles, spacing, and layout
2. Keep all original styling and content, especially <style> tags
3. Implement responsive behavior only after achieving perfect visual match
4. Break down complex designs into manageable components

IMPORTANT NOTES:
1. Keep all image URLs and CSS effects as provided
2. Do not generate or modify SVGs
3. All fonts are pre-licensed - do not import external fonts
`;

type Params = {
    docId: string;
    nodeId: string;
    debug?: boolean;
};

export async function fetchDesignHandler(args: Params) {
    try {
        const html = await fetchDesignHtml(args.docId, args.nodeId, args.debug);
        return {
            content: [{ 
                type: 'text' as const,
                text: html 
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