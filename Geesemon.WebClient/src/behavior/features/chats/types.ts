import {User} from "../auth/types";
import {Entity} from "../../common";

export type Message = {
    text?: string | null
    fromId?: string | null
    from?: User | null
    chatId: string
    readMessages: ReadMessage[]
} & Entity

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
    creatorId: string,
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
}

export enum MessageActionKind {
    Create = "CREATE",
    Update = "UPDATE",
    Delete = "DELETE",
}

export type MessageActions = {
    type:MessageActionKind,
    message: Message,
}


