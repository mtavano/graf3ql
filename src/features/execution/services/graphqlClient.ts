import { GraphQLClient } from 'graphql-request';

export const createClient = (endpoint: string) => {
  return new GraphQLClient(endpoint);
};

export const executeQuery = async (
  endpoint: string,
  query: string,
  variables: Record<string, any> = {}
) => {
  const client = createClient(endpoint);
  const startTime = performance.now();
  try {
    const data = await client.request(query, variables);
    const endTime = performance.now();
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
      error,
    };
  }
};
