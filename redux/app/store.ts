import { configureStore } from '@reduxjs/toolkit';
import librariesSlice from '../features/libraries/librarySlice';

export const store = configureStore({
    reducer: {
        libraries: librariesSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;