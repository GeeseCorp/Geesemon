import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageGetData} from './queries';
import { GeeseTextType } from './types';
import { GeeseText } from '../../../utils/textUtils';

type InitialState = {
    languages: GeeseTextType[];
    geeseTexts: Record<string, GeeseText>;
};

const initialState: InitialState = {
    languages: [],
    geeseTexts: {},
};

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getLanguagesAsync: (state) => state,
        receiveLanguages: (state, action: PayloadAction<GeeseTextType[]>) => {
            state.languages = action.payload;
        },
        getGeeseTextsAsync: (state) => state,
        receiveGeeseTexts: (state, action: PayloadAction<GeeseTextType[]>) => {
            const result: Record<string, GeeseText>  = {};
            for (let i = 0; i < action.payload.length; i++) {
                result[action.payload[i].key] = action.payload[i].value as GeeseText;
            }

            state.geeseTexts = result;
        },
        toInitialState: _ => initialState,
    },
});

export const settingsReducer = slice.reducer;
export const settingsActions = slice.actions;
