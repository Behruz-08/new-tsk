'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

type Props = { children: React.ReactNode };

function Fallback({ error }: { error: Error }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Что-то пошло не так.</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
    </div>
  );
}

export function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback} onError={() => {}}>
      {children}
    </ReactErrorBoundary>
  );
}
