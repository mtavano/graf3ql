export const loadQueriesFromDirectory = async (directoryHandle: any): Promise<string[]> => {
  const queries: string[] = [];
  try {
    // @ts-ignore - File System Access API
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.graphql')) {
        queries.push(entry.name.replace('.graphql', ''));
      }
    }
  } catch (error) {
    console.error('Error reading directory', error);
  }
  return queries;
};
