import React, { useEffect, useRef } from 'react';
import { create } from 'jsondiffpatch';
import * as htmlFormatter from 'jsondiffpatch/formatters/html';
import 'jsondiffpatch/formatters/styles/html.css';

interface Props {
  oldValue: any;
  newValue: any;
}

const diffpatcher = create({});

export const DiffViewer: React.FC<Props> = ({ oldValue, newValue }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const delta = diffpatcher.diff(oldValue, newValue);
      if (delta) {
        containerRef.current.innerHTML = htmlFormatter.format(delta, oldValue) || '';
      } else {
        containerRef.current.innerHTML = '<div class="text-text-muted p-4">No differences found</div>';
      }
    }
  }, [oldValue, newValue]);

  return <div ref={containerRef} className="diff-container p-4 overflow-auto text-sm font-mono" />;
};
