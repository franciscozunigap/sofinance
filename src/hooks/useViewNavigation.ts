import { useState, useCallback } from 'react';

export type ViewType = 'dashboard' | 'analysis' | 'chat' | 'settings';

export const useViewNavigation = (initialView: string = 'dashboard') => {
  const [currentView, setCurrentView] = useState<string>(initialView);

  const navigateTo = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  const goBack = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  return {
    currentView,
    navigateTo,
    goBack,
    setCurrentView
  };
};
