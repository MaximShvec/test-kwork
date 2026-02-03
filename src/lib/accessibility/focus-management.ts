


export const trapFocus = (container: HTMLElement) => {
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {

      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {

      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};


export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => {

      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        window.getComputedStyle(element).visibility !== 'hidden'
      );
    }
  );
};


export const focusFirstElement = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  
  return false;
};


export const createFocusManager = () => {
  let previouslyFocusedElement: HTMLElement | null = null;

  return {
    save: () => {
      previouslyFocusedElement = document.activeElement as HTMLElement;
    },
    restore: () => {
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
        previouslyFocusedElement = null;
      }
    },
  };
};


export const handleEscapeKey = (callback: () => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};


export const createKeyboardNavigator = (
  items: HTMLElement[],
  options?: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  }
) => {
  const { loop = true, orientation = 'vertical' } = options || {};
  let currentIndex = 0;

  const navigate = (direction: 'next' | 'prev') => {
    const increment = direction === 'next' ? 1 : -1;
    let newIndex = currentIndex + increment;

    if (loop) {
      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;
    } else {
      newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
    }

    currentIndex = newIndex;
    items[currentIndex]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const nextKeys = orientation === 'vertical' ? ['ArrowDown'] : ['ArrowRight'];
    const prevKeys = orientation === 'vertical' ? ['ArrowUp'] : ['ArrowLeft'];

    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      navigate('next');
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      navigate('prev');
    } else if (e.key === 'Home') {
      e.preventDefault();
      currentIndex = 0;
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      currentIndex = items.length - 1;
      items[items.length - 1]?.focus();
    }
  };

  return {
    handleKeyDown,
    setIndex: (index: number) => {
      currentIndex = Math.max(0, Math.min(items.length - 1, index));
    },
    getCurrentIndex: () => currentIndex,
  };
};


export const skipToMainContent = (mainContentId: string = 'main-content') => {
  const mainContent = document.getElementById(mainContentId);
  
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();

    mainContent.addEventListener('blur', () => {
      mainContent.removeAttribute('tabindex');
    }, { once: true });
  }
};


export const announceToScreenReader = (
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};


export const isFocusable = (element: HTMLElement): boolean => {
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('tabindex') === '-1') return false;
  
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (focusableTags.includes(element.tagName)) return true;
  
  if (element.hasAttribute('tabindex')) {
    const tabindex = parseInt(element.getAttribute('tabindex') || '0', 10);
    return tabindex >= 0;
  }
  
  return false;
};
