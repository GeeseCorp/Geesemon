import type { GeeseText, Language } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  languages: Language[];
  geeseTexts: Record<string, string>;
};

const initialState: InitialState = {
  languages: [],
  geeseTexts: {},
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getLanguagesAsync: state => state,
    receiveLanguages: (state, action: PayloadAction<Language[]>) => {
      state.languages = action.payload;
    },
    getGeeseTextsAsync: state => state,
    receiveGeeseTexts: (state, action: PayloadAction<GeeseText[]>) => {
      const result: Record<string, string> = {};
      for (let i = 0; i < action.payload.length; i++) 
        result[action.payload[i].key] = action.payload[i].value;

      state.geeseTexts = result;
    },
    toInitialState: _ => initialState,
  },
});

export const settingsReducer = slice.reducer;
export const settingsActions = slice.actions;
