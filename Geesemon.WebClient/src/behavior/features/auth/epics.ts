import {combineEpics, Epic, ofType} from "redux-observable";
import {RootState} from "../../store";
import {catchError, endWith, from, mergeMap, of, startWith} from "rxjs";
import {client} from "../../client";
import {notificationsActions} from "../notifications/slice";
import {authActions} from "./slice";
import {AUTH_ME_QUERY, AuthMeData, AuthMeVars} from "./queries";
import {
    AUTH_LOGIN_MUTATION,
    AUTH_REGISTER_MUTATION,
    AuthLoginData,
    AuthLoginVars,
    AuthRegisterData,
    AuthRegisterVars
} from "./mutations";
import { appActions } from "../app/slice";

export const meAsyncEpic: Epic<ReturnType<typeof authActions.meAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.meAsync.type),
        mergeMap(action =>
            from(client.query<AuthMeData, AuthMeVars>({
                query: AUTH_ME_QUERY,
                variables: {}
            })).pipe(
                mergeMap(response => [
                    authActions.login(response.data.auth.me),
                    appActions.setInitialised(true),
                ]),
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
                variables: {input: action.payload}
            })).pipe(
                mergeMap(response => [
                    authActions.login(response.data.auth.login),
                ]),
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
                variables: {input: action.payload}
            })).pipe(
                mergeMap(response => [
                    authActions.login(response.data.auth.register),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(authActions.setRegisterLoading(true)),
                endWith(authActions.setRegisterLoading(false)),
            )
        )
    );

export const authEpics = combineEpics(
    meAsyncEpic,
    // @ts-ignore
    loginAsyncEpic,
    registerAsyncEpic,
)