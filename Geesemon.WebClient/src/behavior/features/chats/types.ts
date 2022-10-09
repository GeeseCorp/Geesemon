import { Entity } from "../../common";
import { User } from "../users/types";

export type Message = {
    text?: string | null
    type: MessageKind
    fromId?: string | null
    from?: User | null
    chatId: string
    readMessages: ReadMessage[]
} & Entity

export enum MessageKind {
    Regular = 'REGULAR',
    System = 'SYSTEM',
}

export type ReadMessage = {
    messageId: string
    message: Message
    readById: string
    readBy: User
}


export type Chat = {
    name?: string | null
    type: ChatKind
    imageUrl?: string | null
    imageColor: string
    membersTotal: number
    membersOnline: number
    creatorId: string
    messages: Message[]
    users: User[]
} & Entity

export type UserChat = {
    chatId: string
    chat: Chat
    userId: string
    user: User
}

export enum ChatKind {
    Personal = 'PERSONAL',
    Group = 'GROUP',
    Saved = 'SAVED',
}

export enum MessageActionKind {
    Create = "CREATE",
    Update = "UPDATE",
    Delete = "DELETE",
}
export type MessageActions = {
    type: MessageActionKind,
    message: Message,
}


export enum ChatActionKind {
    Create = "CREATE",
    Update = "UPDATE",
    Delete = "DELETE",
    Clear = " CLEAR",
}
export type ChatActions = {
    type: ChatActionKind,
    chat: Chat,
}