export const CONFIG = {
    apiEndpoint: process.env.MOTIFF_HOST || 'https://api.motiff.com',
    serviceName: 'design-mcp',
    version: '0.1.0',
    token: process.env.MOTIFF_TOKEN
} as const;

export const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${CONFIG.token}`,
        'Content-Type': 'application/json',
    },
});

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); 