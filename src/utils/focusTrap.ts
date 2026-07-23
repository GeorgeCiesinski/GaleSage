/**
 * Lightweight Tab focus trap for modal overlays (no external dependency).
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Returns focusable, visible elements within a container (document order).
 *
 * @param container - Element to search within.
 * @returns Focusable HTMLElements that are not aria-hidden or inert ancestors.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      if (element.closest('[inert]')) return false;
      if (element.getAttribute('aria-hidden') === 'true') return false;
      // offsetParent is null for display:none (and fixed/absolute edge cases are still focusable)
      const style = window.getComputedStyle(element);
      return style.visibility !== 'hidden' && style.display !== 'none';
    },
  );
}

/**
 * Keeps Tab / Shift+Tab focus cycling inside `container`.
 *
 * @param container - Dialog or overlay root that should own keyboard focus.
 * @returns Cleanup function that removes the keydown listener.
 */
export function attachFocusTrap(container: HTMLElement): () => void {
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !container.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last || !container.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}
