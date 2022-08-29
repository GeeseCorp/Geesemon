import {MessageActions} from "./types";
import {gql} from "@apollo/client";
import {MESSAGE_FRAGMENT} from "./fragments";

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