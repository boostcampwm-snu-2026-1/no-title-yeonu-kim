import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element not found');
}

const enableMocking = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
};

enableMocking().then(() => {
  createRoot(rootElement!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});
