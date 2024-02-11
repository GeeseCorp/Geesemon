import { combineEpics, Epic, ofType } from 'redux-observable';
import { RootState } from '../../store';
import { catchError, debounceTime, endWith, from, mergeMap, of, startWith } from 'rxjs';
import { client } from '../../client';
import { notificationsActions } from '../notifications/slice';
import { authActions } from './slice';
import { AUTH_ME_QUERY, AuthMeData, AuthMeVars, AuthGetSessionsData, AuthGetSessionsVars, AUTH_GET_SESSIONS_QUERY, AuthGenerateLoginQrCodeData, AuthGenerateLoginQrCodeVars, AUTH_GENERATE_LOGIN_QR_CODE_QUERY, AuthLoginViaTokenData, AUTH_LOGIN_VIA_TOKEN_QUERY, AuthLoginViaTokenVars } from './queries';
import {
  AUTH_LOGIN_MUTATION,
  AUTH_REGISTER_MUTATION,
  AuthLoginData,
  AuthLoginVars,
  AuthRegisterData,
  AuthRegisterVars,
  AUTH_LOGOUT_MUTATION,
  AuthToggleOnlineData,
  AuthToggleOnlineVars,
  AUTH_TOGGLE_ONLINE_MUTATION,
  AuthTermitateAllOtherSessionData,
  AuthTermitateAllOtherSessionVars,
  AUTH_TERMINATE_ALL_OTHER_SESSION_MUTATION,
  AuthTermitateSessionData,
  AuthTermitateSessionVars,
  AUTH_TERMINATE_SESSION_MUTATION,
  AuthUpdateProfileData,
  AuthUpdateProfileVars,
  AUTH_UPDATE_PROFILE_MUTATION,
} from './mutations';
import { appActions } from '../app/slice';
import { navigateActions } from '../navigate/slice';
import { chatActions } from '../chats';
import { usersActions } from '../users/slice';

export const meAsyncEpic: Epic<ReturnType<typeof authActions.meAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.meAsync.type),
    mergeMap(action =>
      from(client.query<AuthMeData, AuthMeVars>({
        query: AUTH_ME_QUERY,
        variables: {},
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length) {
            return [
              ...response.errors.map(e => notificationsActions.addError(e.message)),
              appActions.setInitialised(true),
            ];
          }
          return [
            authActions.login(response.data.auth.me),
            appActions.setInitialised(true),
          ];
        }),
        catchError(error => of(
          notificationsActions.addError(error.message),
          appActions.setInitialised(true),
        )),
        startWith(authActions.setMeLoading(true)),
        endWith(authActions.setMeLoading(false)),
      ),
    ),
  );

export const loginAsyncEpic: Epic<ReturnType<typeof authActions.loginAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.loginAsync.type),
    mergeMap(action =>
      from(client.query<AuthLoginData, AuthLoginVars>({
        query: AUTH_LOGIN_MUTATION,
        variables: { input: action.payload },
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          window.location.reload();
          return [
            authActions.login(response.data.auth.login),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setLoginLoading(true)),
        endWith(authActions.setLoginLoading(false)),
      ),
    ),
  );

export const registerAsyncEpic: Epic<ReturnType<typeof authActions.registerAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.registerAsync.type),
    mergeMap(action =>
      from(client.query<AuthRegisterData, AuthRegisterVars>({
        query: AUTH_REGISTER_MUTATION,
        variables: { input: action.payload },
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          window.location.reload();
          return [
            authActions.login(response.data.auth.register),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setRegisterLoading(true)),
        endWith(authActions.setRegisterLoading(false)),
      ),
    ),
  );

export const logoutEpic: Epic<ReturnType<typeof authActions.logoutAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.logoutAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthLoginData, AuthLoginVars>({
        mutation: AUTH_LOGOUT_MUTATION,
      })).pipe(
        mergeMap(response => {
          window.location.reload();
          return [
            authActions.logout(),
            navigateActions.navigate('/auth/login'),
            chatActions.toInitialState(),
            usersActions.toInitialState(),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setLogoutLoading(true)),
        endWith(authActions.setLogoutLoading(false)),
      ),
    ),
  );

export const toggleOnlineAsyncEpic: Epic<ReturnType<typeof authActions.toggleOnlineAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.toggleOnlineAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthToggleOnlineData, AuthToggleOnlineVars>({
        mutation: AUTH_TOGGLE_ONLINE_MUTATION,
        variables: {
          isOnline: action.payload,
        },
      })).pipe(
        mergeMap(response => {
          return [];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
      ),
    ),
  );

export const getSessionsAsyncEpic: Epic<ReturnType<typeof authActions.getSessionsAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.getSessionsAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthGetSessionsData, AuthGetSessionsVars>({
        mutation: AUTH_GET_SESSIONS_QUERY,
        variables: {},
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          if (!response.data)
            return [notificationsActions.addError('No response for get sessions')];
          return [
            authActions.setSessions(response.data.auth.getSessions),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setSessionsGetLoading(true)),
        endWith(authActions.setSessionsGetLoading(false)),
      ),
    ),
  );

export const terminateSessionAsyncEpic: Epic<ReturnType<typeof authActions.terminateSessionAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.terminateSessionAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthTermitateSessionData, AuthTermitateSessionVars>({
        mutation: AUTH_TERMINATE_SESSION_MUTATION,
        variables: { sessionId: action.payload.sessionId },
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          return [
            authActions.setSessions(state$.value.auth.sessions.filter(s => s.id !== action.payload.sessionId)),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
      ),
    ),
  );

export const terminateAllOtherSessionsAsyncEpic: Epic<ReturnType<typeof authActions.terminateAllOtherSessionsAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.terminateAllOtherSessionsAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthTermitateAllOtherSessionData, AuthTermitateAllOtherSessionVars>({
        mutation: AUTH_TERMINATE_ALL_OTHER_SESSION_MUTATION,
        variables: {},
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          return [
            authActions.setSessions([]),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setTerminateAllOtherSessionsLoading(true)),
        endWith(authActions.setTerminateAllOtherSessionsLoading(false)),
      ),
    ),
  );

export const updateProfileAsyncEpic: Epic<ReturnType<typeof authActions.updateProfileAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(authActions.updateProfileAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthUpdateProfileData, AuthUpdateProfileVars>({
        mutation: AUTH_UPDATE_PROFILE_MUTATION,
        variables: { input: action.payload },
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          return [
            authActions.updateAuthedUser(response.data?.auth.updateProfile),
            notificationsActions.addSuccess('Profile successfully updated'),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setUpdateProfileLoading(true)),
        endWith(authActions.setUpdateProfileLoading(false)),
      ),
    ),
  );

export const generateLoginQrCodeAsyncEpic: Epic<ReturnType<typeof authActions.generateLoginQrCodeAsync>, any, RootState> = (action$, _state$) =>
  action$.pipe(
    ofType(authActions.generateLoginQrCodeAsync.type),
    mergeMap(() =>
      from(client.mutate<AuthGenerateLoginQrCodeData, AuthGenerateLoginQrCodeVars>({
        mutation: AUTH_GENERATE_LOGIN_QR_CODE_QUERY,
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          return [
            authActions.setLoginQrCode(response.data!.auth.generateLoginQrCode),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setGenerateLoginQrCodeLoading(true)),
        endWith(authActions.setGenerateLoginQrCodeLoading(false)),
      ),
    ),
  );

export const loginViaTokenAsyncEpic: Epic<ReturnType<typeof authActions.loginViaTokenAsync>, any, RootState> = (action$, _state$) =>
  action$.pipe(
    ofType(authActions.loginViaTokenAsync.type),
    mergeMap(action =>
      from(client.mutate<AuthLoginViaTokenData, AuthLoginViaTokenVars>({
        mutation: AUTH_LOGIN_VIA_TOKEN_QUERY,
        variables: { token: action.payload },
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          return [
            appActions.setReadQrCode(false),
          ];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(authActions.setLoginViaTokenLoading(true)),
        endWith(authActions.setLoginViaTokenLoading(false)),
      ),
    ),
  );

export const authEpics = combineEpics(
  meAsyncEpic,
  // @ts-ignore
  loginAsyncEpic,
  registerAsyncEpic,
  logoutEpic,
  toggleOnlineAsyncEpic,
  getSessionsAsyncEpic,
  terminateSessionAsyncEpic,
  terminateAllOtherSessionsAsyncEpic,
  updateProfileAsyncEpic,
  generateLoginQrCodeAsyncEpic,
  loginViaTokenAsyncEpic,
);