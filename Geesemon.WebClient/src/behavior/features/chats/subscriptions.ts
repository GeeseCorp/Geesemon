import { ChatActions, MessageActions } from "./types";
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