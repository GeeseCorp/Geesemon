import { Chat, Message } from "./types";
import { createSlice, PayloadAction, } from "@reduxjs/toolkit";
import {
    CreateGroupChatInputType,
    CreatePersonalChatInputType,
    DeleteMessageInputType,
    SentMessageInputType,
    UpdateMessageInputType
} from "./mutations";
import { sortChat } from "../../../utils/chatUtils";
import { MessageGetVars } from "./queries";

export type Mode = 'Text' | 'Audio' | 'Updating' | 'Reply';

type InitialState = {
    chats: Chat[]
    messageGetLoading: boolean
    inUpdateMessageId?: string | null
    mode: Mode
    createChatLoading: boolean
}

const initialState: InitialState = {
    chats: [],
    messageGetLoading: false,
    inUpdateMessageId: null,
    mode: 'Text',
    createChatLoading: false,
};

const slice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        },
        setInUpdateMessageId: (state, action: PayloadAction<string | null | undefined>) => {
            state.inUpdateMessageId = action.payload;
        },
        addChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = sortChat([...state.chats, ...action.payload])
        },
        chatsGetAsync: (state) => state,

        setCreateGroupLoading: (state, action: PayloadAction<boolean>) => {
            state.createChatLoading = action.payload;
        },
        createPersonalChatAsync: (state, action: PayloadAction<CreatePersonalChatInputType>) => state,
        createGroupChatAsync: (state, action: PayloadAction<CreateGroupChatInputType>) => state,

        updateChat: (state, action: PayloadAction<Chat>) => {
            state.chats = state.chats.map(chat =>
                chat.id === action.payload.id
                    ? action.payload
                    : chat
            )
        },

        deleteChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.filter(c => c.id !== action.payload);
        },
        chatDeleteAsync: (state, action: PayloadAction<string>) => state,

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

        deleteMessage: (state, action: PayloadAction<Message>) => {
            const newChats = state.chats.map(chat => {
                chat.messages = chat.messages.filter(m => m.id !== action.payload.id)
                return chat;
            })
            state.chats = sortChat(newChats)
        },

        messageSendAsync: (state, action: PayloadAction<SentMessageInputType>) => state,
        messageUpdateAsync: (state, action: PayloadAction<UpdateMessageInputType>) => state,
        updateMessage: (state, action: PayloadAction<Message>) => {
            const chat = state.chats.find(c => c.messages.some(m => m.id === action.payload.id))
            if (chat) {
                chat.messages = chat.messages.map(message =>
                    message.id === action.payload.id
                        ? action.payload
                        : message
                )
            }
        },
        messageDeleteAsync: (state, action: PayloadAction<DeleteMessageInputType>) => state,

        toInitialState: (state, action: PayloadAction) => initialState,
    },
});

export const chatActions = slice.actions
export const chatReducer = slice.reducer
