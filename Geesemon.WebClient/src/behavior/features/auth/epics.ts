import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../store";
import { catchError, endWith, from, mergeMap, of, startWith } from "rxjs";
import { client } from "../../client";
import { notificationsActions } from "../notifications/slice";
import { authActions } from "./slice";
import { AUTH_ME_QUERY, AuthMeData, AuthMeVars } from "./queries";
import {
    AUTH_LOGIN_MUTATION,
    AUTH_REGISTER_MUTATION,
    AuthLoginData,
    AuthLoginVars,
    AuthRegisterData,
    AuthRegisterVars,
    AUTH_LOGOUT_MUTATION
} from "./mutations";
import { appActions } from "../app/slice";
import { navigateActions } from "../navigate/slice";
import { chatActions } from "../chats";
import { usersActions } from "../users/slice";

export const meAsyncEpic: Epic<ReturnType<typeof authActions.meAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.meAsync.type),
        mergeMap(action =>
            from(client.query<AuthMeData, AuthMeVars>({
                query: AUTH_ME_QUERY,
                variables: {}
            })).pipe(
                mergeMap(response => {
                    if (response.errors?.length) {
                        console.log(response)
                        return [
                            ...response.errors.map(e => notificationsActions.addError(e.message)),
                            appActions.setInitialised(true),
                        ];
                    }
                    return [
                        authActions.login(response.data.auth.me),
                        appActions.setInitialised(true),
                    ]
                }),
                catchError(error => of(
                    notificationsActions.addError(error.message),
                    appActions.setInitialised(true),
                )),
                startWith(authActions.setMeLoading(true)),
                endWith(authActions.setMeLoading(false)),
            )
        )
    );

export const loginAsyncEpic: Epic<ReturnType<typeof authActions.loginAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.loginAsync.type),
        mergeMap(action =>
            from(client.query<AuthLoginData, AuthLoginVars>({
                query: AUTH_LOGIN_MUTATION,
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => {
                    if (response.errors?.length)
                        return response.errors.map(e => notificationsActions.addError(e.message));
                    window.location.reload()
                    return [
                        authActions.login(response.data.auth.login),
                    ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(authActions.setLoginLoading(true)),
                endWith(authActions.setLoginLoading(false)),
            )
        )
    );

export const registerAsyncEpic: Epic<ReturnType<typeof authActions.registerAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.registerAsync.type),
        mergeMap(action =>
            from(client.query<AuthRegisterData, AuthRegisterVars>({
                query: AUTH_REGISTER_MUTATION,
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => {
                    if (response.errors?.length)
                    return response.errors.map(e => notificationsActions.addError(e.message));
                    window.location.reload()
                    return [
                        authActions.login(response.data.auth.register),
                    ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(authActions.setRegisterLoading(true)),
                endWith(authActions.setRegisterLoading(false)),
            )
        )
    );

export const logoutEpic: Epic<ReturnType<typeof authActions.logoutAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.logoutAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthLoginData, AuthLoginVars>({
                mutation: AUTH_LOGOUT_MUTATION,
            })).pipe(
                mergeMap(response => {
                    window.location.reload()
                    return [
                        authActions.logout(),
                        navigateActions.navigate("/auth/login"),
                        chatActions.toInitialState(),
                        usersActions.toInitialState(),
                    ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(authActions.setLogoutLoading(true)),
                endWith(authActions.setLogoutLoading(false)),
            )
        )
    );

export const authEpics = combineEpics(
    meAsyncEpic,
    // @ts-ignore
    loginAsyncEpic,
    registerAsyncEpic,
    logoutEpic
)