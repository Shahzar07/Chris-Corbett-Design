import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountNode = document.getElementById('root');

if (!mountNode) {
  console.error("Critical Error: Root element '#root' not found in DOM.");
} else {
  try {
    const root = createRoot(mountNode);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render React application:", error);
    mountNode.innerHTML = `<div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h2>Application Error</h2>
      <p>Something went wrong during initialization. Please check the console for details.</p>
    </div>`;
  }
}