import { configureStore } from '@reduxjs/toolkit';
import hyperdriveReducer from './hyperdriveSlice';
import shieldsReducer from './shieldsSlice';
import creditsReducer from './creditsSlice';
import missionsReducer from './missionsSlice';

const rootReducer = {
  hyperdrive: hyperdriveReducer,
  shields: shieldsReducer,
  credits: creditsReducer,
  missions: missionsReducer
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

console.log('Initial store state:', store.getState());

export default store; 