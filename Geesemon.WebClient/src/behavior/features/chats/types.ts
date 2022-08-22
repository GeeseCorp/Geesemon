import {User} from "../auth/types";
import {Entity} from "../../common";

export type Chat = {
    name?: string | null
    type: ChatKind
    imageUrl?: string | null
    creatorId: string
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