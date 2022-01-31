import { configureStore } from '@reduxjs/toolkit';
import librarySlice from '../features/libraries/librarySlice';
import librariesSlice from '../features/libraries/librariesSlice';

export const store = configureStore({
    reducer: {
        library: librarySlice,
        libraries: librariesSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;