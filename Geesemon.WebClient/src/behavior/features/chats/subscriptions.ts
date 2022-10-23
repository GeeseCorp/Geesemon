import { Chat, ChatActions, ChatMembers, MessageActions, UserChat } from './types';
import { gql } from '@apollo/client';
import { CHAT_FRAGMENT, MESSAGE_FRAGMENT, USER_CHAT_FRAGMENT } from './fragments';
import { USER_FRAGMENT } from '../users/fragments';

export type MessageActionsData = { messageActions: MessageActions };
export type MessageActionsVars = {};
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
`;

export type ChatActionsData = { chatActions: ChatActions };
export type ChatActionsVars = {token: string};
export const CHAT_ACTIONS_SUBSCRIPTIONS = gql`
    ${CHAT_FRAGMENT}
    subscription ChatActions($token: String!) {
        chatActions(token: $token) {
          type
          chat {
            ...ChatFragment
          }
        }
      }
`;

export type ChatActivityData = { chatActivity: UserChat };
export type ChatActivityVars = { chatId: string; token: string };
export const CHAT_ACTIVITY_SUBSCRIPTIONS = gql`
    ${USER_CHAT_FRAGMENT}
    subscription ChatActivity($chatId: Guid!, $token: String!){
      chatActivity(chatId: $chatId, token: $token){
        ...UserChatFragment
      }
    }
`;

export type ChatMembersData = { chatMembers: ChatMembers };
export type ChatMembersVars = { chatId: string; token: string };
export const CHAT_MEMBERS_SUBSCRIPTIONS = gql`
    ${USER_FRAGMENT}
    subscription ChatMembers($chatId: Guid!, $token: String!){
      chatMembers(chatId: $chatId, token: $token){
        type
        user {
          ...UserFragment
        }
      }
    }
`;