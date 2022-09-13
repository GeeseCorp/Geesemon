import {gql} from "@apollo/client";
import {USER_FRAGMENT} from "../users/fragments";
import {AuthResponseType} from "./types";

export type AuthLoginData = { auth: { login: AuthResponseType } }
export type AuthLoginVars = { input: LoginInputType }
export type LoginInputType = {
    login: string
    password: string
}
export const AUTH_LOGIN_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation AuthLogin($input: LoginInputType!) {
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

export type AuthRegisterData = { auth: { register: AuthResponseType } }
export type AuthRegisterVars = { input: RegisterInputType }
export type RegisterInputType = {
    firstName: string
    lastName: string
    login: string
    email: string
    password: string
}
export const AUTH_REGISTER_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation AuthRegister($input: RegisterInputType!) {
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


export type AuthLogoutData = { auth: { logout: Boolean } }
export type AuthLogoutVars = { }
export const AUTH_LOGOUT_MUTATION = gql`
    mutation AuthLogout {
        auth {
            logout
        }
    }
`;