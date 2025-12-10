// Environment configuration for GraphQL endpoints
// Values are read from environment variables (Vite)

export type Environment = 'local' | 'acc' | 'stage' | 'prod';

const endpoints: Record<Environment, string> = {
  local: import.meta.env.VITE_GRAPHQL_ENDPOINT_LOCAL || 'http://localhost:3000/graphql',
  acc: import.meta.env.VITE_GRAPHQL_ENDPOINT_ACC || '',
  stage: import.meta.env.VITE_GRAPHQL_ENDPOINT_STAGE || '',
  prod: import.meta.env.VITE_GRAPHQL_ENDPOINT_PROD || '',
};

export const getEndpointForEnvironment = (env: Environment): string => {
  const endpoint = endpoints[env];
  if (!endpoint) {
    console.warn(`No endpoint configured for environment: ${env}`);
  }
  return endpoint;
};

export const isEnvironmentConfigured = (env: Environment): boolean => {
  return Boolean(endpoints[env]);
};

