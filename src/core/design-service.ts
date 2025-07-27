import { CONFIG, getHeaders, sleep } from '../utils/config.js';

export async function fetchDesignHtml(docId: string, nodeId: string, debug: boolean = false): Promise<string> {
    if (!CONFIG.token) {
        throw new Error('MOTIFF_TOKEN environment variable is required');
    }

    try {
        // Step 1: Create the task
        const createTaskResponse = await fetch(
            `${CONFIG.apiEndpoint}/api/v1/documents/html?docId=${docId}&nodeId=${nodeId}`,
            {
                ...getHeaders(),
                method: 'POST',
            }
        );

        if (!createTaskResponse.ok) {
            throw new Error(`Failed to create task: ${createTaskResponse.statusText}`);
        }

        const taskId = await createTaskResponse.text();

        // Step 2: Poll for task completion
        let status = 'DOING';
        let result = null;
        let attempts = 0;
        const maxAttempts = 60;

        while (status === 'DOING' && attempts < maxAttempts) {
            attempts++;
            const statusResponse = await fetch(
                `${CONFIG.apiEndpoint}/api/v1/documents/html/${taskId}`,
                getHeaders()
            );

            if (!statusResponse.ok) {
                throw new Error(`Failed to get task status: ${statusResponse.statusText}`);
            }

            result = await statusResponse.json();
            status = result.status;

            if (status === 'FAILED') {
                throw new Error(`HTML generation failed. Please check if nodeId: ${nodeId} and docId: ${docId} are valid.`);
            }

            if (status === 'DOING') {
                await sleep(1000); // Wait 1 second before polling again
            }
        }

        if (status === 'SUCCESS' && result?.dataUrl) {
            // Fetch the actual HTML content
            const htmlResponse = await fetch(result.dataUrl);
            if (!htmlResponse.ok) {
                throw new Error(`Failed to fetch HTML content: ${htmlResponse.statusText}`);
            }

            const html = await htmlResponse.text();
            return html;
        } else if (status === 'FAILED') {
            throw new Error('Task failed to generate HTML');
        } else if (attempts >= maxAttempts) {
            throw new Error('Timed out waiting for HTML generation');
        }

        throw new Error('Unknown error occurred while generating HTML');
    } catch (error) {
        console.error('Error fetching design HTML:', error);
        throw error;
    }
}

async function fetchPreviewUrl(docId: string, nodeId: string): Promise<string> {
    if (!CONFIG.token) {
        throw new Error('MOTIFF_TOKEN environment variable is required');
    }

    try {
        // Step 1: Create the task
        const createTaskResponse = await fetch(
            `${CONFIG.apiEndpoint}/api/v1/documents/image?docId=${docId}&nodeId=${nodeId}&scale=THUMBNAIL`,
            {
                ...getHeaders(),
                method: 'POST',
            }
        );

        if (!createTaskResponse.ok) {
            throw new Error(`Failed to create preview task: ${createTaskResponse.statusText}`);
        }

        const taskId = await createTaskResponse.text();

        // Step 2: Poll for task completion
        let attempts = 0;
        const maxAttempts = 120;

        while (attempts < maxAttempts) {
            attempts++;
            const statusResponse = await fetch(
                `${CONFIG.apiEndpoint}/api/v1/documents/image/${taskId}`,
                getHeaders()
            );

            if (!statusResponse.ok) {
                throw new Error(`Failed to get preview task status: ${statusResponse.statusText}`);
            }

            const result = await statusResponse.json();

            if (result?.status === 'FAILED') {
                throw new Error(`Preview generation failed. Please check if nodeId: ${nodeId} and docId: ${docId} are valid.`);
            }

            // Check for success status and extract URL from nodeId2Url mapping
            if (result?.status === 'SUCCESS' && result.nodeId2Url) {
                const nodeIdKey = Object.keys(result.nodeId2Url)[0];
                if (nodeIdKey && result.nodeId2Url[nodeIdKey]) {
                    return result.nodeId2Url[nodeIdKey];
                }
            }

            // Fallback to direct URL (for backward compatibility)
            if (result?.status === 'SUCCESS' && result.url) {
                return result.url;
            }

            await sleep(1000); // Wait before polling again
        }

        throw new Error('Timed out waiting for preview generation');
    } catch (error) {
        console.error('Error fetching preview URL:', error);
        throw error;
    }
}

export async function fetchDesignPreview(docId: string, nodeId: string): Promise<{ data: string; format: string }> {
    try {
        // First get the image URL
        const imageUrl = await fetchPreviewUrl(docId, nodeId);
        
        // Fetch the image data
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }

        // Get the mime type from response headers
        const contentType = imageResponse.headers.get('content-type') || 'image/png';

        // Get image as buffer and convert to base64
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);
        const base64 = imageBuffer.toString('base64');

        return {
            data: base64,
            format: contentType
        };
    } catch (error) {
        console.error('Error fetching design preview:', error);
        throw error;
    }
} 