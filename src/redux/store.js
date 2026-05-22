import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Note: You would add a taskReducer here following the exact same pattern
  },
});

export default store;