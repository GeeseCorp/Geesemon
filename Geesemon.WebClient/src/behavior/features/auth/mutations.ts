import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../users/fragments';
import { AuthResponseType } from './types';

export type AuthLoginData = { auth: { login: AuthResponseType } };
export type AuthLoginVars = { input: LoginInputType };
export type LoginInputType = {
    username: string;
    password: string;
};
export const AUTH_LOGIN_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation AuthLogin($input: AuthLoginInputType!) {
        auth {
            login(input: $input) {
                user {
                    ...UserFragment
                }
                token
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
    mutation AuthRegister($input: AuthRegisterInputType!) {
        auth {
            register(input: $input) {
                user {
                    ...UserFragment
                }
                token
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