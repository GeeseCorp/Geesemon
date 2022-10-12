import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { string } from 'yup';
import { shallowUpdateChat, sortChat } from '../../../utils/chatUtils';
import { User } from '../users/types';
import {
    CreateGroupChatInputType,
    CreatePersonalChatInputType,
    DeleteMessageInputType,
    MessageMakeReadVars,
    SentMessageInputType,
    UpdateMessageInputType,
} from './mutations';
import { MessageGetVars } from './queries';
import { Chat, Message, UserChat } from './types';

export type Mode = 'Text' | 'Audio' | 'Updating' | 'Reply';

type InitialState = {
    chats: Chat[];
    chatsGetLoading: boolean;

    messageGetLoading: boolean;

    inUpdateMessageId?: string | null;
    mode: Mode;

    createChatLoading: boolean;

    messageIdsMakeReadLoading: string[];
    inViewMessageIdReadBy?: string | null;

    chatByUsername?: Chat | null;
    chatGetByUsernameLoading: boolean;
};

const initialState: InitialState = {
    chats: [],
    chatsGetLoading: false,

    messageGetLoading: false,

    inUpdateMessageId: null,
    mode: 'Text',

    createChatLoading: false,

    messageIdsMakeReadLoading: [],
    inViewMessageIdReadBy: null,

    chatByUsername: null,
    chatGetByUsernameLoading: false,
};

const slice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        },
        setInUpdateMessageId: (state, action: PayloadAction<string | null | undefined>) => {
            state.inUpdateMessageId = action.payload;
        },
        addChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = sortChat([...state.chats, ...action.payload]);
        },
        chatsGetAsync: state => state,
        setChatsGetLoading: (state, action: PayloadAction<boolean>) => {
            state.chatsGetLoading = action.payload;
        },

        setCreateGroupLoading: (state, action: PayloadAction<boolean>) => {
            state.createChatLoading = action.payload;
        },
        createPersonalChatAsync: (state, action: PayloadAction<CreatePersonalChatInputType>) => state,
        createGroupChatAsync: (state, action: PayloadAction<CreateGroupChatInputType>) => state,

        updateChat: (state, action: PayloadAction<Chat>) => {
            const newChats = state.chats.map(chat =>
                chat.id === action.payload.id
                    ? action.payload
                    : chat,
            );
            state.chats = sortChat(newChats);
        },

        deleteChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.filter(c => c.id !== action.payload);
        },
        chatDeleteAsync: (state, action: PayloadAction<string>) => state,

        setMessageGetLoading: (state, action: PayloadAction<boolean>) => {
            state.messageGetLoading = action.payload;
        },
        messageGetAsync: (state, action: PayloadAction<MessageGetVars>) => state,
        addMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
            const newChats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId) {
                    chat.messages = [...action.payload.messages, ...chat.messages];
                    chat.messages = chat.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                }
                return chat;
            });
            state.chats = sortChat(newChats);
        },

        deleteMessage: (state, action: PayloadAction<Message>) => {
            const newChats = state.chats.map(chat => {
                chat.messages = chat.messages.filter(m => m.id !== action.payload.id);
                return chat;
            });
            state.chats = sortChat(newChats);
        },

        messageSendAsync: (state, action: PayloadAction<{sentMessageInputType: SentMessageInputType; chatId: string}>) => state,
        messageUpdateAsync: (state, action: PayloadAction<UpdateMessageInputType>) => state,
        updateMessage: (state, action: PayloadAction<Message>) => {
            const chat = state.chats.find(c => c.messages.some(m => m.id === action.payload.id));
            if (chat) {
                chat.messages = chat.messages.map(message =>
                    message.id === action.payload.id
                        ? action.payload
                        : message,
                );
            }
        },
        messageDeleteAsync: (state, action: PayloadAction<DeleteMessageInputType>) => state,

        updateUserInChat: (state, action: PayloadAction<UserChat>) => {
            state.chats = state.chats.map(c => c.id === action.payload.chatId
                ? {
                    ...c, users: c.users.map(u => u.id === action.payload.user.id
                        ? { ...u, ...action.payload.user }
                        : u),
                }
                : c);
        },

        shallowUpdateChat: (state, action: PayloadAction<Chat>) => {
            state.chats = state.chats.map(c => c.id === action.payload.id
                ? shallowUpdateChat(c, action.payload)
                : c);
        },

        addMessageIdMakeReadLoading: (state, action: PayloadAction<string>) => {
            if (!state.messageIdsMakeReadLoading.find(m => m === action.payload))
                state.messageIdsMakeReadLoading.push(action.payload);
        },
        removeMessageIdMakeReadLoading: (state, action: PayloadAction<string>) => {
            state.messageIdsMakeReadLoading = state.messageIdsMakeReadLoading.filter(m => m !== action.payload);
        },
        messageMakeReadAsync: (state, action: PayloadAction<MessageMakeReadVars>) => state,

        setInViewMessageIdReadBy: (state, action: PayloadAction<string | null | undefined>) => {
            state.inViewMessageIdReadBy = action.payload;
        },

        addReadBy: (state, action: PayloadAction<{ messageId: string; readBy: User[] }>) => {
            state.chats = state.chats.map(c => c.messages.some(m => m.id === action.payload.messageId)
                ? {
                    ...c,
                    messages: c.messages.map(m => {
                        if (m.id === action.payload.messageId)
                            return { ...m, readBy: [...m.readBy, ...action.payload.readBy] };
                        else
                            return m;
                    }),
                }
                : c);
        },
    
        chatGetByUsernameAsync: (state, action: PayloadAction<string>) => state,
        setChatByUsername: (state, action: PayloadAction<Chat | null | undefined>) => {
            state.chatByUsername = action.payload;
        },
        setChatGetByUsernameLoading: (state, action: PayloadAction<boolean>) => {
            state.chatGetByUsernameLoading = action.payload;
        },

        toInitialState: (state, action: PayloadAction) => initialState,
    },
});

export const chatActions = slice.actions;
export const chatReducer = slice.reducer;
