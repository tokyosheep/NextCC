import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export type LibraryProps = {
    name:string,
    id:string
};

interface LibrariesProps {
    value:LibraryProps[]
};

const initialState:LibrariesProps = {
    value:[]
}

const librariesSlice = createSlice({
    name:'libraries',
    initialState,
    reducers: {
        setLibraries: (state, action:PayloadAction<LibraryProps[]>) => {
            state.value = action.payload;
        }
    }
});

export const { setLibraries } = librariesSlice.actions;

export const libraies = (state:RootState) => state.libraries;

export default librariesSlice.reducer;