import React, { useState } from 'react';
import { useTicketsStore } from '../../tickets/store';
import { MonacoEditorWrapper } from './MonacoEditorWrapper';
import { QuerySelector } from '../../execution/components/QuerySelector';
import { EnvironmentSelector } from '../../execution/components/EnvironmentSelector';
import { RunQueryButton } from '../../execution/components/RunQueryButton';
import { DiffViewer } from '../../diff/components/DiffViewer';
import { Columns, GitCompare, Save, Wand2 } from 'lucide-react';
import { print, parse } from 'graphql';

export const Workspace: React.FC = () => {
  const { activeTicketId, getTicketById, updateTicket } = useTicketsStore();
  const ticket = activeTicketId ? getTicketById(activeTicketId) : undefined;
  const [showDiff, setShowDiff] = useState(false);

  if (!ticket) return null;

  const handleSaveOriginal = () => {
    if (ticket.latestResponse) {
      updateTicket(ticket.id, { originalResponse: ticket.latestResponse });
    }
  };

  const handlePrettyPrint = () => {
    if (!ticket.queryText) return;
    
    try {
      const ast = parse(ticket.queryText);
      const formatted = print(ast);
      updateTicket(ticket.id, { queryText: formatted });
    } catch (error) {
      // Si hay error de parsing, no hacer nada (query inválida)
      console.warn('Could not format query:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-12 border-b border-border-default bg-bg-secondary flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <QuerySelector />
          <EnvironmentSelector />
        </div>
        <RunQueryButton />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Editors Area */}
        <div className="flex-1 flex min-h-0 border-b border-border-default">
          <div className="w-3/5 border-r border-border-default flex flex-col">
            <div className="px-4 py-2 bg-bg-tertiary border-b border-border-default text-xs font-medium text-text-secondary flex justify-between items-center">
              <span>QUERY</span>
              <button
                onClick={handlePrettyPrint}
                disabled={!ticket.queryText}
                className="p-1 rounded hover:bg-bg-secondary text-text-muted hover:text-neon-purple disabled:opacity-50 transition-colors"
                title="Pretty Print (Format)"
              >
                <Wand2 size={14} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <MonacoEditorWrapper
                language="graphql"
                value={ticket.queryText || ''}
                onChange={(value) => updateTicket(ticket.id, { queryText: value || '' })}
              />
            </div>
          </div>
          <div className="w-2/5 flex flex-col">
            <div className="px-4 py-2 bg-bg-tertiary border-b border-border-default text-xs font-medium text-text-secondary">
              VARIABLES
            </div>
            <div className="flex-1 min-h-0">
              <MonacoEditorWrapper
                language="json"
                value={JSON.stringify(ticket.variables, null, 2)}
                onChange={(value) => {
                  try {
                    const parsed = JSON.parse(value || '{}');
                    updateTicket(ticket.id, { variables: parsed });
                  } catch (e) {
                    // Ignore JSON parse errors while typing
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Response Area */}
        <div className="flex-1 flex min-h-0 bg-bg-primary flex-col">
          <div className="h-8 bg-bg-tertiary border-b border-border-default flex items-center justify-between px-4">
             <span className="text-xs font-medium text-text-secondary">RESPONSE</span>
             <div className="flex gap-2">
               <button
                 onClick={handleSaveOriginal}
                 disabled={!ticket.latestResponse}
                 className="p-1 rounded hover:bg-bg-tertiary text-text-muted hover:text-neon-green disabled:opacity-50 transition-colors"
                 title="Save as Original"
               >
                 <Save size={14} />
               </button>
               <div className="w-px h-4 bg-border-default mx-1 self-center" />
               <button
                 onClick={() => setShowDiff(false)}
                 className={`p-1 rounded ${!showDiff ? 'bg-neon-purple/20 text-neon-purple' : 'text-text-muted hover:text-text-primary'}`}
                 title="Split View"
               >
                 <Columns size={14} />
               </button>
               <button
                 onClick={() => setShowDiff(true)}
                 className={`p-1 rounded ${showDiff ? 'bg-neon-purple/20 text-neon-purple' : 'text-text-muted hover:text-text-primary'}`}
                 title="Diff View"
               >
                 <GitCompare size={14} />
               </button>
             </div>
          </div>

          {showDiff ? (
            <div className="flex-1 min-h-0 overflow-hidden">
               <DiffViewer oldValue={ticket.originalResponse} newValue={ticket.latestResponse} />
            </div>
          ) : (
            <div className="flex-1 flex min-h-0">
              <div className="w-1/2 border-r border-border-default flex flex-col">
                <div className="px-4 py-2 bg-bg-tertiary border-b border-border-default text-xs font-medium text-text-secondary flex justify-between">
                  <span>ORIGINAL RESPONSE</span>
                  {ticket.originalResponse && (
                    <span className="text-text-muted">Saved</span>
                  )}
                </div>
                <div className="flex-1 min-h-0">
                  <MonacoEditorWrapper
                    language="json"
                    value={ticket.originalResponse ? JSON.stringify(ticket.originalResponse, null, 2) : ''}
                    onChange={(value) => {
                      try {
                        const parsed = JSON.parse(value || '{}');
                        updateTicket(ticket.id, { originalResponse: parsed });
                      } catch (e) {
                        // Ignore JSON parse errors while typing
                      }
                    }}
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col">
                <div className="px-4 py-2 bg-bg-tertiary border-b border-border-default text-xs font-medium text-text-secondary flex justify-between">
                  <span>LATEST RESPONSE</span>
                  {ticket.latestResponse && (
                    <span className="text-neon-green">Success</span>
                  )}
                </div>
                <div className="flex-1 min-h-0">
                  <MonacoEditorWrapper
                    language="json"
                    value={ticket.latestResponse ? JSON.stringify(ticket.latestResponse, null, 2) : ''}
                    onChange={(value) => {
                      try {
                        const parsed = JSON.parse(value || '{}');
                        updateTicket(ticket.id, { latestResponse: parsed });
                      } catch (e) {
                        // Ignore JSON parse errors while typing
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
