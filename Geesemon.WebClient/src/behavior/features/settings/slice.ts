import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageGetData} from './queries';
import { GeeseText } from './types';

type InitialState = {
    languages: GeeseText[];
    geeseTexts: GeeseText[];
};

const initialState: InitialState = {
    languages: [],
    geeseTexts: [],
};

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getLanguagesAsync: (state, action: PayloadAction) => state,
        receiveLanguages: (state, action: PayloadAction<GeeseText[]>) => {
            state.languages = action.payload;
        },
        getGeeseTextsAsync: (state, action: PayloadAction) => state,
        receiveGeeseTexts: (state, action: PayloadAction<GeeseText[]>) => {
            state.geeseTexts = action.payload;
        },
        toInitialState: (state, action: PayloadAction) => initialState,
    },
});

export const settingsReducer = slice.reducer;
export const settingsActions = slice.actions;
