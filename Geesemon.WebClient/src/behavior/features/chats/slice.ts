import {Chat, Message} from "./types";
import {createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {CreateGroupChatInputType, DeleteMessageInputType, SentMessageInputType} from "./mutations";
import {sortChat} from "../../../utils/chatUtils";
import {MessageGetVars} from "./queries";

type InitialState = {
    chats: Chat[],
    messageGetLoading: boolean,
}

const initialState: InitialState = {
    chats: [],
    messageGetLoading: false,
};

const slice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        addChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = [...state.chats, ...action.payload]
        },
        getAsync: (state) => state,

        setMessageGetLoading: (state, action: PayloadAction<boolean>) => {
            state.messageGetLoading = action.payload;
        },
        messageGetAsync: (state, action: PayloadAction<MessageGetVars>) => state,
        addMessages: (state, action: PayloadAction<{ chatId: string, messages: Message[] }>) => {
            const newChats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId) {
                    chat.messages = [...action.payload.messages, ...chat.messages];
                    chat.messages = chat.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                }
                return chat;
            })
            state.chats = sortChat(newChats)
        },
        // addMessageInEnd: (state, action: PayloadAction<Message>) => {
        //     const newChats = state.chats.map(chat => {
        //         if (chat.id === action.payload.chatId) {
        //             chat.messages = [...chat.messages, action.payload];
        //             chat.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        //         }
        //         return chat;
        //     })
        //     state.chats = sortChat(newChats)
        // },
        deleteMessage: (state, action: PayloadAction<Message>) => {
            const newChats = state.chats.map(chat => {
                chat.messages = chat.messages.filter(m => m.id !== action.payload.id)
                return chat;
            })
            state.chats = sortChat(newChats)
        },

        createGroupChatAsync: (state, action: PayloadAction<CreateGroupChatInputType>) => state,
        messageSendAsync: (state, action: PayloadAction<SentMessageInputType>) => state,

        messageDeleteAsync: (state, action: PayloadAction<DeleteMessageInputType>) => state,
    },
});

export const chatActions = slice.actions
export const chatReducer = slice.reducer
