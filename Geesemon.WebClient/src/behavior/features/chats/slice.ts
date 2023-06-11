import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shallowUpdateChat, sortChat } from '../../../utils/chatUtils';
import { User } from '../users/types';
import {
    ChatsAddMembersInputType,
    CreateGroupChatInputType,
    CreatePersonalChatInputType,
    DeleteMessageInputType,
    MessageMakeReadVars,
    SentMessageInputType,
    UpdateChatInputType,
    UpdateMessageInputType,
} from './mutations';
import { ChatsGetVars, MessageGetVars } from './queries';
import { Chat, Message, UserChat } from './types';

export enum Mode {
    Text = 0,
    Audio = 1,
    Updating = 2,
    Reply = 3,
    ForwardSelectChat = 4,
    Forward = 5,
}

type InitialState = {
    chats: Chat[];
    chatsGetLoading: boolean;
    chatsGetHasNext: boolean;

    messageGetLoading: boolean;
    messagesGetHasNext: boolean;

    replyMessageId?: string | null;
    inUpdateMessageId?: string | null;
    forwardMessageIds: string[];
    selectedMessageIds: string[];
    mode: Mode;

    createChatLoading: boolean;
    updateChatLoading: boolean;

    messageIdsMakeReadLoading: string[];
    inViewMessageIdReadBy?: string | null;

    chatByIdentifier?: Chat | null;
    chatGetByIdentifierLoading: boolean;

    chatAddMembersLoading: boolean;
};

const initialState: InitialState = {
    chats: [],
    chatsGetLoading: false,
    chatsGetHasNext: true,

    messageGetLoading: false,
    messagesGetHasNext: true,

    replyMessageId: null,
    inUpdateMessageId: null,
    forwardMessageIds: [],
    selectedMessageIds: [],
    mode: Mode.Text,

    createChatLoading: false,
    updateChatLoading: false,

    messageIdsMakeReadLoading: [],
    inViewMessageIdReadBy: null,

    chatByIdentifier: null,
    chatGetByIdentifierLoading: false,

    chatAddMembersLoading: false,
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
        setReplyMessageId: (state, action: PayloadAction<string | null | undefined>) => {
            state.replyMessageId = action.payload;
        },
        setForwardMessageIds: (state, action: PayloadAction<string[]>) => {
            state.forwardMessageIds = action.payload;
        },
        setSelectedMessageIds: (state, action: PayloadAction<string[]>) => {
            state.selectedMessageIds = action.payload;
        },

        addChats: (state, action: PayloadAction<Chat[]>) => {
            if (action.payload.length)
                state.chats = sortChat([...state.chats, ...action.payload]);
        },
        chatsGetAsync: (state, action: PayloadAction<ChatsGetVars>) => state,
        setChatsGetLoading: (state, action: PayloadAction<boolean>) => {
            state.chatsGetLoading = action.payload;
        },
        setChatsGetHasNext: (state, action: PayloadAction<boolean>) => {
            state.chatsGetHasNext = action.payload;
        },

        setCreateGroupLoading: (state, action: PayloadAction<boolean>) => {
            state.createChatLoading = action.payload;
        },
        createPersonalChatAsync: (state, action: PayloadAction<CreatePersonalChatInputType>) => state,
        createGroupChatAsync: (state, action: PayloadAction<CreateGroupChatInputType>) => state,

        updateChatAsync: (state, action: PayloadAction<UpdateChatInputType>) => state,

        setUpdateChatLoading: (state, action: PayloadAction<boolean>) => {
            state.updateChatLoading = action.payload;
        },

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
        setMessagesGetHasNext: (state, action: PayloadAction<boolean>) => {
            state.messageGetLoading = action.payload;
        },
        messageGetAsync: (state, action: PayloadAction<MessageGetVars>) => state,
        addInStartMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
            const newChats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId) {
                    let addMessages = [...action.payload.messages];
                    addMessages = addMessages.filter(message => !chat.messages.some(m => m.id === message.id));
                    chat.messages = [...addMessages, ...chat.messages];
                    // chat.messages = chat.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                }
                return chat;
            });
            state.chats = sortChat(newChats);
        },
        addInEndMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
            const newChats = state.chats.map(chat => {
                if (chat.id === action.payload.chatId) {
                    chat.messages = [...chat.messages, ...action.payload.messages];
                    // chat.messages = chat.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                }
                return chat;
            });
            state.chats = sortChat(newChats);
        },

        deleteMessage: (state, action: PayloadAction<Message>) => {
            const newChats = state.chats.map(chat => {
                chat.messages = chat.messages.filter(m => m.id !== action.payload.id);
                chat.messages = chat.messages.map(m => m.replyMessageId === action.payload.id
                    ? { ...m, replyMessageId: null, replyMessage: null }
                    : m);
                return chat;
            });
            state.chats = sortChat(newChats);
        },

        messageSendAsync: (state, action: PayloadAction<{ chatId: string; sentMessageInput: SentMessageInputType }>) => state,
        messageUpdateAsync: (state, action: PayloadAction<UpdateMessageInputType>) => state,
        updateMessage: (state, action: PayloadAction<Message>) => {
            const chat = state.chats.find(c => c.messages.some(m => m.id === action.payload.id));
            if (chat) {
                chat.messages = chat.messages.map(message =>
                    message.id === action.payload.id
                        ? action.payload
                        : message.replyMessageId === action.payload.id
                            ? { ...message, replyMessageId: action.payload.id, replyMessage: action.payload }
                            : message,
                );
            }
        },
        messageDeleteAsync: (state, action: PayloadAction<DeleteMessageInputType>) => state,

        addOrUpdateUserInChat: (state, action: PayloadAction<UserChat>) => {
            if (state.chats.find(c => c.users.find(u => u.id === action.payload.userId))) {
                state.chats = state.chats.map(c => c.id === action.payload.chatId
                    ? {
                        ...c, users: [action.payload.user, ...c.users],
                    }
                    : c);
            }
            else {
                state.chats = state.chats.map(c => c.id === action.payload.chatId
                    ? {
                        ...c, users: c.users.map(u => u.id === action.payload.user.id
                            ? { ...u, ...action.payload.user }
                            : u),
                    }
                    : c);
            }
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

        chatGetByIdentifierAsync: (state, action: PayloadAction<string>) => state,
        setChatByIdentifier: (state, action: PayloadAction<Chat | null | undefined>) => {
            state.chatByIdentifier = action.payload;
        },
        setChatGetByIdentifierLoading: (state, action: PayloadAction<boolean>) => {
            state.chatGetByIdentifierLoading = action.payload;
        },

        chatAddMembersAsync: (state, action: PayloadAction<ChatsAddMembersInputType>) => state,
        chatAddMembers: (state, action: PayloadAction<{ chatId: string; members: User[] }>) => {
            state.chats = state.chats.map(c => c.id === action.payload.chatId
                ? { ...c, users: [...action.payload.members, ...c.users] }
                : c);
        },
        setChatAddMembersLoading: (state, action: PayloadAction<boolean>) => {
            state.chatAddMembersLoading = action.payload;
        },

        chatRemoveMembersAsync: (state, action: PayloadAction<ChatsAddMembersInputType>) => state,
        chatRemoveMembers: (state, action: PayloadAction<{ chatId: string; members: User[] }>) => {
            state.chats = state.chats.map(c => c.id === action.payload.chatId
                ? { ...c, users: c.users.filter(u => !action.payload.members.some(m => m.id === u.id)) }
                : c);
        },

        toInitialState: (state, action: PayloadAction) => initialState,
    },
});

export const chatActions = slice.actions;
export const chatReducer = slice.reducer;
