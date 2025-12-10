export interface QueryInfo {
  name: string;      // Nombre sin extensión
  path: string;      // Ruta relativa dentro del directorio
  content?: string;  // Contenido del archivo (opcional)
}

// Función recursiva para buscar archivos .graphql
const scanDirectory = async (
  directoryHandle: FileSystemDirectoryHandle,
  basePath: string = ''
): Promise<QueryInfo[]> => {
  const queries: QueryInfo[] = [];
  
  // @ts-expect-error - File System Access API not fully typed
  for await (const entry of directoryHandle.values()) {
    const entryPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    
    if (entry.kind === 'directory') {
      // Recursivamente escanear subdirectorios
      const subQueries = await scanDirectory(entry as FileSystemDirectoryHandle, entryPath);
      queries.push(...subQueries);
    } else if (entry.kind === 'file' && entry.name.endsWith('.graphql')) {
      queries.push({
        name: entry.name.replace('.graphql', ''),
        path: entryPath,
      });
    }
  }
  
  return queries;
};

export const loadQueriesFromDirectory = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<QueryInfo[]> => {
  try {
    return await scanDirectory(directoryHandle);
  } catch (error) {
    console.error('Error reading directory', error);
    return [];
  }
};

// Leer el contenido de una query específica
export const readQueryContent = async (
  directoryHandle: FileSystemDirectoryHandle,
  queryPath: string
): Promise<string | null> => {
  try {
    const pathParts = queryPath.split('/');
    let currentHandle: FileSystemDirectoryHandle = directoryHandle;
    
    // Navegar hasta el directorio que contiene el archivo
    for (let i = 0; i < pathParts.length - 1; i++) {
      currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
    }
    
    // Obtener el archivo
    const fileName = pathParts[pathParts.length - 1];
    const fileHandle = await currentHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.text();
  } catch (error) {
    console.error('Error reading query file', error);
    return null;
  }
};
