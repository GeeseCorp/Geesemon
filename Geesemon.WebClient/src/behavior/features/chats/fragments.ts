import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../users/fragments';

export const MESSAGE_WITHOUT_REPLY_MESSAGE_FRAGMENT = gql`
    ${USER_FRAGMENT}
    fragment MessageWithoutReplyMessageFragment on MessageType {
        id
        text
        type
        isEdited
        fromId
        from {
            ...UserFragment
        }
        chatId
        isEdited
        readBy {
            ...UserFragment
        }
        readByCount
        createdAt
        updatedAt
    }
`;

export const MESSAGE_FRAGMENT = gql`
    ${USER_FRAGMENT}
    ${MESSAGE_WITHOUT_REPLY_MESSAGE_FRAGMENT}
    fragment MessageFragment on MessageType {
        ...MessageWithoutReplyMessageFragment
        replyMessageId
        replyMessage {
            ...MessageWithoutReplyMessageFragment
        }
    }
`;

export const CHAT_FRAGMENT = gql`
    ${USER_FRAGMENT}
    ${MESSAGE_FRAGMENT}
    fragment ChatFragment on ChatType {
        id
        name
        identifier
        type
        imageUrl
        imageColor
        membersTotal
        membersOnline
        notReadMessagesCount
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
`;

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
`;