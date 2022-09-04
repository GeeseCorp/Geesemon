import {gql} from "@apollo/client";
import {USER_FRAGMENT} from "../users/fragments";

export const MESSAGE_FRAGMENT = gql`
    ${USER_FRAGMENT}
    fragment MessageFragment on MessageType {
        id
        text
        type
        fromId
        from {
            ...UserFragment
        }
        chatId
        isEdited
        createdAt
        updatedAt
    }
`

export const CHAT_FRAGMENT = gql`
    ${USER_FRAGMENT}
    ${MESSAGE_FRAGMENT}
    fragment ChatFragment on ChatType {
        id
        name
        type
        imageUrl
        creatorId
        users {
            ...UserFragment
        }
        messages(skip: 0) {
            ...MessageFragment
        }
        createdAt
        updatedAt
    }
`