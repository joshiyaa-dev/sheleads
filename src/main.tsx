import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('splash')?.classList.add('gone'), 900);
  setTimeout(() => document.getElementById('splash')?.remove(), 1600);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
