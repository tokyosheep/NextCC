
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export type ElementProps = {
    name:string,
    id:string,
    rendition:string
}

export type LibraryProps = {
    name:string,
    id:string,
    elements:ElementProps[]
}

interface LibrariesProps {
    value:LibraryProps
}

const initialState:LibrariesProps = {
    value:{
        id: '',
        name: '',
        elements: []
    }
}

const librariesSlice = createSlice({
    name: 'libraries',
    initialState,
    reducers: {
        setLibraies: (state,action:PayloadAction<LibraryProps>) => {
            state.value = action.payload;
        }
    }
});

export const { setLibraies } = librariesSlice.actions;

export const libraries = (state:RootState) => state.libraries;

export default  librariesSlice.reducer;