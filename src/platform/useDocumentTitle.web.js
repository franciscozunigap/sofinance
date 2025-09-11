// Polyfill para useDocumentTitle en web
import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
};

export default useDocumentTitle;
