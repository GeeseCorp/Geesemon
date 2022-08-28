import {MessageAction} from "./types";
import {gql} from "@apollo/client";
import {MESSAGE_FRAGMENT} from "./fragments";

export type MessageActionsData = { actions: MessageAction }
export type MessageActionsVars = {}
export const MESSAGE_ACTIONS_SUBSCRIPTIONS = gql`
    ${MESSAGE_FRAGMENT}
    subscription MessageActions {
        actions {
            type
            message {
                ...MessageFragment
            }
        }
    }
`