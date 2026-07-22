/**
 * Theme context: shares the active color theme across the component tree.
 *
 * Exposes a ThemeProvider that owns the theme state. Keeping the state in one provider ensures
 * every consumer (header toggle, settings, etc.) stays in sync.
 */
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';

type Theme = 'light' | 'dark';

/**
 * Retrieves saved theme from local storage if it exists, otherwise returns the
 * user's preferred color scheme.
 *
 * @returns The initial color theme.
 */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Provides theme state to all descendants and persists changes.
 *
 * Owns the single source of theme state, applies it to the document's
 * data-theme attribute, and mirrors it to local storage on every change.
 *
 * @param props - Component props.
 * @param props.children - The subtree that can access the theme.
 * @returns The provider wrapping the given children.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // document.documentElement is <html> element, same element :root targets in CSS
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Toggles the active theme between light and dark.
   */
  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
