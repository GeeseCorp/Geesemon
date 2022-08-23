import {Chat, ChatKind} from "./types";
import {createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {User} from "../auth/types";
import {Message} from "../messages";

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
                    id: '10',
                    from: {} as User,
                    fromId: '822a004a-cab1-4f3d-88e0-7ef725a05298',
                    chatId: '1',
                    text: 'GG WP',
                    readMessages: [],
                    createdAt: '2022-08-19T16:13:12Z',
                    updatedAt: '2022-08-19T16:13:12Z',
                },
                {
                    id: '11',
                    from: {} as User,
                    fromId: '822a004a-cab1-4f3d-88e0-7ef725a05298',
                    chatId: '1',
                    text: 'GG WP',
                    readMessages: [],
                    createdAt: '2022-08-19T16:13:12Z',
                    updatedAt: '2022-08-19T16:13:12Z',
                },
                {
                    id: '3',
                    from: {} as User,
                    fromId: '1',
                    chatId: '1',
                    text: 'Gg wp #2',
                    readMessages: [],
                    createdAt: '2022-08-19T16:13:12Z',
                    updatedAt: '2022-08-19T16:13:13Z',
                },
                {
                    id: '30',
                    from: {} as User,
                    fromId: '1',
                    chatId: '1',
                    text: 'Gg wp #2',
                    readMessages: [],
                    createdAt: '2022-08-20T16:13:12Z',
                    updatedAt: '2022-08-20T16:13:13Z',
                },
            ],
            users: [],
            createdAt: '2022-08-19T16:13:12Z',
            updatedAt: '2022-08-19T16:13:13Z',
        },
        {
            id: '2',
            name: 'Alesha',
            type: ChatKind.Personal,
            creatorId: '',
            messages: [
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
        getAsync: (state) => state,
        addMessagesInBegin: (state, action: PayloadAction<{ chatId: string, messages: Message[] }>) => {
            state.chats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId)
                    chat.messages = [...action.payload.messages, ...chat.messages]
                return chat
            })
        },
        addMessagesInEnd: (state, action: PayloadAction<{ chatId: string, messages: Message[] }>) => {
            state.chats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId)
                    chat.messages = [...chat.messages, ...action.payload.messages]
                return chat
            })
        },
    },
});

export const chatActions = slice.actions
export const chatReducer = slice.reducer
