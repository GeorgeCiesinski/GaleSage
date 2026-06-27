/**
 * Theme context: shares the active color theme across the component tree.
 *
 * Exposes a ThemeProvider that owns the theme state and a useTheme hook for
 * consumers to read and toggle it. Keeping the state in one provider ensures
 * every consumer (header toggle, settings, etc.) stays in sync.
 */
import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

/**
 * Channel that carries the theme value to descendants.
 *
 * Defaults to undefined so useTheme can detect usage outside a ThemeProvider.
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Retrieves saved theme from local storage if it exists, otherwise returns the
 * user's preferred color scheme.
 *
 * @returns The initial color theme.
 */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
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

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

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
