import { useEnvironmentsStore } from '../../environments/store';

// URL del proxy server (relativa para funcionar en cualquier dominio)
const DEFAULT_PROXY_URL = import.meta.env.VITE_PROXY_URL || '/api/proxy';

// Obtener la URL del proxy (dinámica en Electron)
const getProxyUrl = (): string => {
  const { proxyUrl, isElectron } = useEnvironmentsStore.getState();

  if (isElectron && proxyUrl) {
    return proxyUrl;
  }

  return DEFAULT_PROXY_URL;
};

export interface GraphQLResponse {
  data: any;
  duration: number;
  error: any;
}

export const executeQuery = async (
  endpoint: string,
  query: string,
  variables: Record<string, any> = {},
  headers: Record<string, string> = {}
): Promise<GraphQLResponse> => {
  const startTime = performance.now();
  const proxyUrl = getProxyUrl();

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetUrl: endpoint,
        query,
        variables,
        headers,
      }),
    });

    const data = await response.json();
    const endTime = performance.now();

    // Check if the proxy returned an error
    if (data.error && !data.data) {
      return {
        data: null,
        duration: Math.round(endTime - startTime),
        error: data,
      };
    }

    return {
      data,
      duration: Math.round(endTime - startTime),
      error: null,
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      data: null,
      duration: Math.round(endTime - startTime),
      error: error instanceof Error ? { message: error.message } : { message: 'Unknown error' },
    };
  }
};
