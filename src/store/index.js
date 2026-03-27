import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budgetSlice';
import { saveToLocalStorage } from '../utils/storage';

const store = configureStore({
  reducer: {
    budget: budgetReducer,
  },
});

let saveTimeout;
store.subscribe(() => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToLocalStorage(store.getState().budget);
  }, 500);
});

export default store;
