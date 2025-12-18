// Environment configuration for GraphQL endpoints
// Now supports dynamic configuration via environments store

import { useEnvironmentsStore } from '../features/environments/store';

export type Environment = string;

// Legacy fallbacks from env vars (for backwards compatibility in web mode)
const legacyEndpoints: Record<string, string> = {
  local: import.meta.env.VITE_GRAPHQL_ENDPOINT_LOCAL || 'http://localhost:3000/graphql',
  acc: import.meta.env.VITE_GRAPHQL_ENDPOINT_ACC || '',
  stage: import.meta.env.VITE_GRAPHQL_ENDPOINT_STAGE || '',
  prod: import.meta.env.VITE_GRAPHQL_ENDPOINT_PROD || '',
};

export const getEndpointForEnvironment = (env: Environment): string => {
  // First, try to get from the environments store (in-app configuration)
  const { environments } = useEnvironmentsStore.getState();
  const configuredEnv = environments.find((e) => e.name === env);

  if (configuredEnv?.url) {
    return configuredEnv.url;
  }

  // Fallback to legacy env vars
  const legacyEndpoint = legacyEndpoints[env];
  if (legacyEndpoint) {
    return legacyEndpoint;
  }

  console.warn(`No endpoint configured for environment: ${env}`);
  return '';
};

export const isEnvironmentConfigured = (env: Environment): boolean => {
  const { environments } = useEnvironmentsStore.getState();
  const configuredEnv = environments.find((e) => e.name === env);

  if (configuredEnv?.url) {
    return true;
  }

  return Boolean(legacyEndpoints[env]);
};

export const getAvailableEnvironments = (): string[] => {
  const { environments } = useEnvironmentsStore.getState();
  return environments.map((e) => e.name);
};

