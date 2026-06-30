/**
 * Application entry point.
 *
 * Mounts the React app into the root element and loads global styles.
 */

import { createRoot } from 'react-dom/client';
import { StrictMode } from "react";
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';
import './styles/main.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
