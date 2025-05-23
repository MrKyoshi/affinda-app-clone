import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function Root() {
  useEffect(() => {
    const stop = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);
  return <App />;
}

const container = document.getElementById('root');
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
