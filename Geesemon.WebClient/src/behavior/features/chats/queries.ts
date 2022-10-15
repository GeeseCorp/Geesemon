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

export type ChatsGetByUsernameData = { chat: { getByUsername: Chat } };
export type ChatsGetByUsernameVars = { username: string };
export const CHATS_GET_BY_USERNAME_QUERY = gql`
    ${CHAT_FRAGMENT}
    query ChatGetByUsername($username: String!) {
        chat {
          getByUsername(username: $username) {
            ...ChatFragment
          }
        }
    }
`;

export type MessageGetData = { message: { get: Message[] } };
export type MessageGetVars = { chatId: string; skip: number; take?: number | null };
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