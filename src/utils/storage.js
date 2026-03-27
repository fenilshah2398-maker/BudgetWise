import Cookies from 'js-cookie';

const STORAGE_KEY = 'budgetwise_data';
const COOKIE_KEY = 'budgetwise_session';

export const saveToLocalStorage = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    Cookies.set(COOKIE_KEY, JSON.stringify({ lastUpdated: Date.now(), hasData: true }), { expires: 365 });
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  Cookies.remove(COOKIE_KEY);
};

export const hasExistingSession = () => {
  const cookie = Cookies.get(COOKIE_KEY);
  return cookie ? JSON.parse(cookie).hasData : false;
};
