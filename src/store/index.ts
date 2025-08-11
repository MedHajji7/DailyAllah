import { configureStore } from '@reduxjs/toolkit';
import quran from './quranSlice';
import audio from './audioSlice';

export const store = configureStore({ reducer: { quran, audio } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
