import React from 'react';
import ReactDOM, {Root, createRoot} from 'react-dom/client';
import './styles/index.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { el } from './scripts/utils';
import { assert } from 'console';

// Timeout, then render the app
// TODO: Remove this timeout
setTimeout(() => {
  const root: Root = createRoot(el('root')!); // TODO: asserts that the root element exists, make safer

  el('loader')?.remove(); // removes the loader

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}, 6000);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
