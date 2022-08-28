import {gql} from "@apollo/client";
import {CHAT_FRAGMENT, MESSAGE_FRAGMENT} from "./fragments";
import {Chat, Message} from "./types";

export type ChatsCreateGroupData = { chat: { createGroup: Chat } }
export type ChatsCreateGroupVars = { input: CreateGroupChatInputType }
export type CreateGroupChatInputType = {
    name: string
    image?: File | null,
    usersId: string[],
}
export const CHATS_CREATE_GROUP_MUTATION = gql`
    ${CHAT_FRAGMENT}
    mutation ChatCreateGroup($input: CreateGroupChatInputType!){
        chat {
            createGroup(input: $input){
                ...ChatFragment
            }
        }
    }
`

export type MessagesSendData = { message: { sent: Message } }
export type MessagesSendVars = { message: MessageInputType  }
export type MessageInputType  = {
    text: string
    chatId: string
}
export const MESSAGES_SEND_MUTATION = gql`
    ${MESSAGE_FRAGMENT}
    mutation MessageSent($message: MessageInputType!){
        message {
            sent(message: $message){
                ...ChatFragment
            }
        }
    }
`