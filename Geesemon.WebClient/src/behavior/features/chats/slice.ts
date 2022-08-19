import {Chat, ChatKind} from "./types";
import {createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {User} from "../auth/types";

type InitialState = {
    chats: Chat[],
}

const initialState: InitialState = {
    chats: [
        {
            id: '1',
            name: 'Yehor',
            type: ChatKind.Personal,
            creatorId: '',
            creator: {} as User,
            users: [],
            createdAt: '2022-08-19T16:13:12Z',
            updatedAt: '2022-08-19T16:13:13Z',
        },
        {
            id: '2',
            name: 'Alesha',
            type: ChatKind.Personal,
            creatorId: '',
            creator: {} as User,
            users: [],
            createdAt: '2022-08-19T16:13:12Z',
            updatedAt: '2022-08-19T16:13:13Z',
        },
    ],
};

const slice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        addChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = [...state.chats, ...action.payload]
        },
    },
});

export const chatActions = slice.actions
export const chatReducer = slice.reducer
