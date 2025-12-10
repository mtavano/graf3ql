import { Layout } from './components/Layout';
import { TicketDetail } from './features/tickets/components/TicketDetail';
import { Workspace } from './features/editor/components/Workspace';
import { useTicketsStore } from './features/tickets/store';

function App() {
  const activeTicketId = useTicketsStore(state => state.activeTicketId);

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
