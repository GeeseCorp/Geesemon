import { Entity } from '../../common';
import { User } from '../users/types';

export type ForwardedMessage = {
    text?: string | null;
    type: MessageKind;
    fromId?: string | null;
    from?: User | null;
    fileUrl?: string | null;
};

export type Message = {
    text?: string | null;
    type: MessageKind;
    isEdited: boolean;
    fromId?: string | null;
    from?: User | null;
    chatId: string;
    replyMessageId?: string | null;
    replyMessage?: Message | null;
    readBy: User[];
    readByCount: number;
    fileUrl?: string;
    forwardedMessage?: ForwardedMessage | null;
} & Entity;

export enum MessageKind {
    Regular = 'REGULAR',
    System = 'SYSTEM',
}

export type ReadMessage = {
    messageId: string;
    message: Message;
    readById: string;
    readBy: User;
};

export type Chat = {
    name: string;
    identifier: string;
    type: ChatKind;
    imageUrl?: string | null;
    imageColor: string;
    membersTotal: number;
    membersOnline: number;
    notReadMessagesCount: number;
    creatorId: string;
    messages: Message[];
    users: User[];
} & Entity;

export type UserChat = {
    chatId: string;
    chat: Chat;
    userId: string;
    user: User;
};

export enum ChatKind {
    Personal = 'PERSONAL',
    Group = 'GROUP',
    Saved = 'SAVED',
}

export enum MessageActionKind {
    Create = 'CREATE',
    Update = 'UPDATE',
    Delete = 'DELETE',
}
export type MessageActions = {
    type: MessageActionKind;
    message: Message;
};

export enum ChatActionKind {
    Add = 'ADD',
    Update = 'UPDATE',
    Delete = 'DELETE',
    Clear = ' CLEAR',
}
export type ChatActions = {
    type: ChatActionKind;
    chat: Chat;
};

export enum ChatMembersKind {
    Add = 'ADD',
    Delete = 'DELETE',
}
export type ChatMembers = {
    type: ChatMembersKind;
    user: User;
};