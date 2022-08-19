import {createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {User} from "../auth/types";
import {Message, ReadMessage} from "./types";

type InitialState = {
    messages: Message[],
}

const initialState: InitialState = {
    messages: [
        {
            id: '1',
            from: {} as User,
            fromId: '1',
            chatId: '1',
            text: 'GG WP',
            readMessages: [],
            createdAt: '2022-08-19T16:13:12Z',
            updatedAt: '2022-08-19T16:13:12Z',
        },
        {
            id: '3',
            from: {} as User,
            fromId: '78308d99-aaf2-47d7-90e6-017e4634817c',
            chatId: '1',
            text: 'Gg wp #2',
            readMessages: [],
            createdAt: '2022-08-19T16:13:12Z',
            updatedAt: '2022-08-19T16:13:13Z',
        },
        {
            id: '2',
            from: {} as User,
            fromId: '2',
            chatId: '2',
            text: 'POWER RANGER',
            readMessages: [],
            createdAt: '2022-08-19T16:13:12Z',
            updatedAt: '2022-08-19T16:13:12Z',
        },
    ],
};

const slice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = [...state.messages, ...action.payload]
        },
    },
});

export const messagesActions = slice.actions
export const messagesReducer = slice.reducer
