import React from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';

interface Props {
  language: 'graphql' | 'json';
  value: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

export const MonacoEditorWrapper: React.FC<Props> = ({ language, value, onChange, readOnly }) => {
  const handleEditorDidMount: OnMount = (_, monaco) => {
    monaco.editor.defineTheme('graf3ql-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1f3a', // bg-secondary
      }
    });
    monaco.editor.setTheme('graf3ql-dark');
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'Inter, monospace',
        readOnly,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
};
