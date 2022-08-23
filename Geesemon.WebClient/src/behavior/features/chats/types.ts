import {User} from "../auth/types";
import {Entity} from "../../common";
import {Message} from "../messages";

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