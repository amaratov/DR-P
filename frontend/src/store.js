import { configureStore } from '@reduxjs/toolkit';
import { rootReducers } from './features/slices/index';

const store = configureStore({
  reducer: rootReducers,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export default store;
