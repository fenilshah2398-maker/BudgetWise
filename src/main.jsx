import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import { loadFromLocalStorage } from './utils/storage';
import { loadState } from './store/budgetSlice';
import App from './App';
import './index.css';

const savedState = loadFromLocalStorage();
if (savedState) {
  store.dispatch(loadState(savedState));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
