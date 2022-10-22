import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../users/fragments';
import { User } from '../users/types';
import { SESSION_FRAGMENT } from './fragments';
import { AuthResponseType, Session } from './types';

export type AuthLoginData = { auth: { login: AuthResponseType } };
export type AuthLoginVars = { input: LoginInputType };
export type LoginInputType = {
    username: string;
    password: string;
};
export const AUTH_LOGIN_MUTATION = gql`
    ${USER_FRAGMENT}
    ${SESSION_FRAGMENT}
    mutation AuthLogin($input: AuthLoginInputType!) {
        auth {
            login(input: $input) {
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

export type AuthRegisterData = { auth: { register: AuthResponseType } };
export type AuthRegisterVars = { input: RegisterInputType };
export type RegisterInputType = {
    firstName: string;
    lastName?: string | null;
    username: string;
    email?: string | null;
    password: string;
};
export const AUTH_REGISTER_MUTATION = gql`
    ${USER_FRAGMENT}
    ${SESSION_FRAGMENT}
    mutation AuthRegister($input: AuthRegisterInputType!) {
        auth {
            register(input: $input) {
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

export type AuthLogoutData = { auth: { logout: boolean } };
export type AuthLogoutVars = {};
export const AUTH_LOGOUT_MUTATION = gql`
    mutation AuthLogout {
        auth {
            logout
        }
    }
`;

export type AuthToggleOnlineData = { auth: { toggleOnline: boolean } };
export type AuthToggleOnlineVars = { isOnline: boolean };
export const AUTH_TOGGLE_ONLINE_MUTATION = gql`
    mutation AuthToggleOnline($isOnline: Boolean!) {
        auth {
            toggleOnline(isOnline: $isOnline)
        }
    }
`;

export type AuthTermitateSessionData = { auth: { terminateAllOtherSessions: Session[] } };
export type AuthTermitateSessionVars = { sessionId: string};
export const AUTH_TERMINATE_SESSION_MUTATION = gql`
${SESSION_FRAGMENT}
    mutation AuthTerminateSession($sessionId: Guid!) {
        auth {
            terminateSession(sessionId: $sessionId) {
                ...SessionFragment
            }
        }
    }
`;

export type AuthTermitateAllOtherSessionData = { auth: { terminateAllOtherSessions: Session[] } };
export type AuthTermitateAllOtherSessionVars = { };
export const AUTH_TERMINATE_ALL_OTHER_SESSION_MUTATION = gql`
${SESSION_FRAGMENT}
    mutation AuthTerminateAllOtherSessions {
        auth {
            terminateAllOtherSessions{
                ...SessionFragment
            }
        }
    }
`;

export type AuthUpdateProfileData = { auth: { updateProfile: User } };
export type AuthUpdateProfileVars = {input: AuthUpdateProfileType};
export type AuthUpdateProfileType = {
    firstname: string;
    lastname?: string | null;
    username: string;
    imageUrl?: string | null;
    image?: File | null;
};
export const AUTH_UPDATE_PROFILE_MUTATION = gql`
${USER_FRAGMENT}
mutation AuthUpdateProfile($input: AuthUpdateProfileType!) {
    auth {
        updateProfile(input: $input) {
            ...UserFragment
        }
    }
}
`;