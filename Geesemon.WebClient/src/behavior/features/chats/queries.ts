import {gql} from "@apollo/client";
import {CHAT_FRAGMENT} from "./fragments";
import {Chat} from "./types";

export type ChatsGetData = {chat: {get: Chat[]}}
export type ChatsGetVars = {}
export const CHATS_GET_QUERY = gql`
    ${CHAT_FRAGMENT}
    query ChatGet {
        chat {
            get {
                ...ChatFragment
            }
        }
    }

`