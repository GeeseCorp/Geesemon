import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Paging } from '../../common';
import { Chat } from './types';

export enum Mode {
  Chat = 'Chat',
}

type InitialState = {
  chats: Chat[];
  chatsGetLoading: boolean;
  chatsGetHasNext: boolean;

  mode: Mode;
};

const initialState: InitialState = {
  chats: [],
  chatsGetLoading: false,
  chatsGetHasNext: true,

  mode: Mode.Chat,
};

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },

    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = [...state.chats, ...action.payload];
    },
    chatsGetAsync: (state, action: PayloadAction<{ keywords: string; paging: Paging }>) => state,
    setChatsGetLoading: (state, action: PayloadAction<boolean>) => {
      state.chatsGetLoading = action.payload;
    },
    setChatsGetHasNext: (state, action: PayloadAction<boolean>) => {
      state.chatsGetHasNext = action.payload;
    },

    toInitialState: (state, action: PayloadAction) => initialState,
  },
});

export const searchActions = slice.actions;
export const searchReducer = slice.reducer;
