/**
 * Header control for switching between light and dark themes.
 */

import { useTheme } from '../context/ThemeContext';

/**
 * Renders a button that toggles the active color theme.
 *
 * Reads the current theme from ThemeContext and flips it on click. The label
 * and accessible description always describe the theme the user will switch to.
 *
 * @returns The theme toggle button.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
