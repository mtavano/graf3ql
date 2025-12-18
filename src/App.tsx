import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { TicketDetail } from './features/tickets/components/TicketDetail';
import { Workspace } from './features/editor/components/Workspace';
import { useTicketsStore } from './features/tickets/store';
import { useEnvironmentsStore } from './features/environments/store';

function App() {
  const activeTicketId = useTicketsStore(state => state.activeTicketId);
  const initializeFromElectron = useEnvironmentsStore(state => state.initializeFromElectron);

  // Inicializar configuración desde Electron si está disponible
  useEffect(() => {
    initializeFromElectron();
  }, [initializeFromElectron]);

  return (
    <Layout>
      {activeTicketId ? (
        <>
          <TicketDetail />
          <Workspace />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-muted">
          Select a ticket to start
        </div>
      )}
    </Layout>
  );
}

export default App;
