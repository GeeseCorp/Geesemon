import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../users/fragments';
import { SESSION_FRAGMENT } from './fragments';
import { AuthResponseType, LoginQrCode, Session } from './types';

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

export type AuthGenerateLoginQrCodeData = { auth: { generateLoginQrCode: LoginQrCode } };
export type AuthGenerateLoginQrCodeVars = {};
export const AUTH_GENERATE_LOGIN_QR_CODE_QUERY = gql`
    mutation {
        auth {
            generateLoginQrCode {
                qrCodeUrl
                token
            }
        }
    }
`;

export type AuthLoginViaTokenData = { auth: { loginViaToken: AuthResponseType } };
export type AuthLoginViaTokenVars = { token: string };
export const AUTH_LOGIN_VIA_TOKEN_QUERY = gql`
    mutation ($token: String!) {
        auth {
            loginViaToken(token: $token){
                token
                user {
                    ...UserFragment
                }
            }
        }
    }
    ${USER_FRAGMENT}
`;

