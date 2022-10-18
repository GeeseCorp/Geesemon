import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../users/fragments';
import { SESSION_FRAGMENT } from './fragments';
import { AuthResponseType, Session } from './types';

export type AuthMeData = { auth: { me: AuthResponseType } };
export type AuthMeVars = {};
export const AUTH_ME_QUERY = gql`
    ${USER_FRAGMENT}
    ${SESSION_FRAGMENT}
    query MeQuery {
        auth {
            me {
                user {
                    ...UserFragment
                }
                token
                session {
                    ...SessionFragment
                }
            }
        }
    }
`;

export type AuthGetSessionsData = { auth: { getSessions: Session[] } };
export type AuthGetSessionsVars = {};
export const AUTH_GET_SESSIONS_QUERY = gql`
    ${SESSION_FRAGMENT}
    query AuthGetSessions {
        auth {
          getSessions {
            ...SessionFragment
          }
        }
      }
`;

