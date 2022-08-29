import {gql} from "@apollo/client";
import {CHAT_FRAGMENT, MESSAGE_FRAGMENT} from "./fragments";
import {Chat, Message} from "./types";

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

export type MessageSendData = { message: { send: Message } }
export type MessageSendVars = { input: SentMessageInputType  }
export type SentMessageInputType  = {
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

export type MessageDeleteData = { message: { delete: Message } }
export type MessageDeleteVars = { input: DeleteMessageInputType  }
export type DeleteMessageInputType  = {
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