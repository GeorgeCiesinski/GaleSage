/**
 * useTheme hook.
 *
 * Provides typed access to the active theme and toggle function from
 * ThemeContext, and guards against being called outside of a ThemeProvider.
 */
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Reads the current theme and toggle function from ThemeContext.
 *
 * @throws If called outside of a ThemeProvider.
 * @returns The active theme and a function to toggle it.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
