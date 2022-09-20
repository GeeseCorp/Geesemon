import { Chat, ChatActions, MessageActions } from "./types";
import { gql } from "@apollo/client";
import { CHAT_FRAGMENT, MESSAGE_FRAGMENT } from "./fragments";

export type MessageActionsData = { messageActions: MessageActions }
export type MessageActionsVars = {}
export const MESSAGE_ACTIONS_SUBSCRIPTIONS = gql`
    ${MESSAGE_FRAGMENT}
    subscription MessageActions {
        messageActions {
            type
            message {
                ...MessageFragment
            }
        }
    }
`


export type ChatActionsData = { chatActions: ChatActions }
export type ChatActionsVars = {}
export const CHAT_ACTIONS_SUBSCRIPTIONS = gql`
    ${CHAT_FRAGMENT}
    subscription ChatActions {
        chatActions {
          type
          chat {
            ...ChatFragment
          }
        }
      }
`


export type ChatActivityData = { chatActivity: Chat }
export type ChatActivityVars = { chatId: string }
export const CHAT_ACTIVITY_SUBSCRIPTIONS = gql`
    ${CHAT_FRAGMENT}
    subscription ChatActivity($chatId: Guid!){
      chatActivity(chatId: $chatId){
        ...ChatFragment
      }
    }
`