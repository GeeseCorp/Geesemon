import { gql } from '@apollo/client';
import { CHAT_FRAGMENT, MESSAGE_FRAGMENT } from './fragments';
import { Chat, Message } from './types';

export type ChatsGetData = { chat: { get: Chat[] } };
export type ChatsGetVars = { skip: number; take: number };
export const CHATS_GET_QUERY = gql`
    ${CHAT_FRAGMENT}
    query ChatGet($skip: Int!, $take: Int) {
        chat {
            get(skip: $skip, take: $take) {
                ...ChatFragment
            }
        }
    }
`;

export type ChatsGetByIdentifierData = { chat: { getByIdentifier: Chat } };
export type ChatsGetByIdentifierVars = { identifier: string };
export const CHATS_GET_BY_IDENTIFIER_QUERY = gql`
    ${CHAT_FRAGMENT}
    query ChatGetByIdentifier($identifier: String!) {
        chat {
          getByIdentifier(identifier: $identifier) {
            ...ChatFragment
          }
        }
    }
`;

export type MessageGetData = { message: { get: Message[] } };
export type MessageGetVars = { chatId: string; skip: number; take: number };
export const MESSAGE_GET_QUERY = gql`
    ${MESSAGE_FRAGMENT}
    query MessageGet($chatId: Guid!, $skip: Int!, $take: Int) {
        message {
            get(chatId: $chatId, skip: $skip, take: $take) {
                ...MessageFragment
            }
        }
    }

`;