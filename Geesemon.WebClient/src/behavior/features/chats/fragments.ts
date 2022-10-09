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
        imageColor
        membersTotal
        membersOnline
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


export const USER_CHAT_FRAGMENT = gql`
    ${USER_FRAGMENT}
    ${CHAT_FRAGMENT}
    fragment UserChatFragment on UserChatType {
        userId
        user {
            ...UserFragment
        }
        chatId
        chat {
            ...ChatFragment
        }
    }
`