import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import taskReducer from './slice/taskSlice';
import themeReducer from './slice/themeSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    theme: themeReducer,
  },
});

// RootState represents the state shape of the entire Redux store
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch is the type for the `dispatch` function in our Redux store
export type AppDispatch = typeof store.dispatch;

// Create a custom hook to use the typed `dispatch` function
export const useAppDispatch = () => useDispatch<AppDispatch>();
