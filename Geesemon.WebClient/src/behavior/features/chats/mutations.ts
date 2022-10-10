import { gql } from "@apollo/client";
import { CHAT_FRAGMENT, MESSAGE_FRAGMENT } from "./fragments";
import { Chat, Message } from "./types";

export type ChatCreateGroupData = { chat: { createGroup: Chat } }
export type ChatCreateGroupVars = { input: CreateGroupChatInputType }
export type CreateGroupChatInputType = {
    name: string
    image?: File | null,
    usersId: string[],
}
export const CHAT_CREATE_GROUP_MUTATION = gql`
    ${CHAT_FRAGMENT}
    mutation ChatCreateGroup($input: CreateGroupChatInputType!){
        chat {
            createGroup(input: $input){
                ...ChatFragment
            }
        }
    }
`


export type ChatCreatePersonalData = { chat: { createPersonal: Chat } }
export type ChatCreatePersonalVars = { input: CreatePersonalChatInputType }
export type CreatePersonalChatInputType = {
    userId: string
}
export const CHAT_CREATE_PERSONAL_MUTATION = gql`
    ${CHAT_FRAGMENT}
    mutation ChatCreatePersonal($input: CreatePersonalChatInputType!) {
        chat {
            createPersonal(input: $input) {
                ...ChatFragment
            }
        }
    }
`


export type ChatDeleteData = { chat: { delete: boolean } }
export type ChatDeleteVars = { input: string }
export const CHAT_DELETE_MUTATION = gql`
    mutation ChatDelete($input: Guid!) {
        chat {
            delete(input: $input)
        }
      }
`

export type MessageSendData = { message: { send: Message } }
export type MessageSendVars = { input: SentMessageInputType }
export type SentMessageInputType = {
    text: string
    chatId: string
}
export const MESSAGE_SEND_MUTATION = gql`
    ${MESSAGE_FRAGMENT}
    mutation MessageSent($input: SentMessageInputType!){
        message {
            send(input: $input){
                ...MessageFragment
            }
        }
    }
`

export type MessageUpdateData = { message: { update: Message } }
export type MessageUpdateVars = { input: UpdateMessageInputType }
export type UpdateMessageInputType = {
    messageId: string
    text: string
}
export const MESSAGE_UPDATE_MUTATION = gql`
    ${MESSAGE_FRAGMENT}
    mutation MessageUpdate($input: UpdateMessageInputType!) {
        message{
            update(input: $input) {
                ...MessageFragment
            }
        }
    }
`

export type MessageDeleteData = { message: { delete: Message } }
export type MessageDeleteVars = { input: DeleteMessageInputType }
export type DeleteMessageInputType = {
    messageId: string
}
export const MESSAGE_DELETE_MUTATION = gql`
    ${MESSAGE_FRAGMENT}
    mutation MessageDelete($input: DeleteMessageInputType!){
        message{
            delete(input: $input){
                ...MessageFragment
            }
        }
    }

`