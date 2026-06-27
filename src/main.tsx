/**
 * Application entry point.
 *
 * Mounts the React app into the root element and loads global styles.
 */

import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './styles/main.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
