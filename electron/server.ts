import express, { Express } from 'express';
import cors from 'cors';
import type { Server } from 'http';

let server: Server | null = null;
let app: Express | null = null;

export async function startServer(preferredPort: number = 3005): Promise<number> {
  if (server) {
    console.log('Servidor ya está corriendo');
    return preferredPort;
  }

  app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Proxy endpoint para GraphQL (evita CORS/preflight)
  app.post('/api/proxy', async (req, res) => {
    const { targetUrl, query, variables, headers: customHeaders } = req.body;

    if (!targetUrl) {
      res.status(400).json({ error: 'targetUrl is required' });
      return;
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({
        error: 'Proxy request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Buscar un puerto disponible
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      server = app!.listen(port)
        .on('listening', () => {
          console.log(`🚀 Proxy server running on http://localhost:${port}`);
          resolve(port);
        })
        .on('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Puerto ${port} en uso, intentando ${port + 1}...`);
            server = null;
            tryPort(port + 1);
          } else {
            reject(err);
          }
        });
    };

    tryPort(preferredPort);
  });
}

export async function stopServer(): Promise<void> {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log('Servidor proxy detenido');
        server = null;
        app = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}
