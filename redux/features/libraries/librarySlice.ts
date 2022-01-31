
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CMYK, RGB, ColorType } from '../../../types/color';

export type Representation = {
    representName:string|null,
    storage_href:string|null,
    width:number|null,
    height:number|null,
    type:string,
    isColor:boolean
};

export type RepresetationColor = {
    data:{
        mode:ColorType,
        profileName:string,
        spotColorName:string,
        value:CMYK|RGB,
        type:string
    },
    type:string,
    isColor:boolean,
    representName:string|null,
}

export const branchColorOrImg:(isColor:boolean,representation:any)=>Representation|RepresetationColor = (isColor,representation) => {
    if(!isColor){
        return {
            storage_href:representation?.storage_href ?? null,
            representName:representation.name,
            type:representation.type,
            width:representation?.width ?? null,
            height:representation?.height ?? null,
            isColor
        }
    }else{
        return {
            data: {...representation['color#data']},
            representName:representation.name,
            type:representation.type,
            isColor
        }
    }
}

/*
name + representation.name's extension = filename;
it can be filename on local
*/

/*
type file format type
*/

/*
storage_href storage path which contains file data
*/

export type ElementProps = {
    name:string,
    id:string,
    rendition:string,
    representations:Representation[]|RepresetationColor[]
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

const librarySlice = createSlice({
    name: 'libraries',
    initialState,
    reducers: {
        setLibrary: (state,action:PayloadAction<LibraryProps>) => {
            state.value = action.payload;
        }
    }
});

export const { setLibrary } = librarySlice.actions;

export const library = (state:RootState) => state.library;

export default  librarySlice.reducer;