import { combineEpics, Epic, ofType } from 'redux-observable';
import {
  catchError,
  debounceTime,
  endWith,
  from,
  mergeMap,
  of,
  startWith,
} from 'rxjs';
import { client } from '../../client';
import { RootState } from '../../store';
import { notificationsActions } from '../notifications/slice';
import { UsersGetData, UsersGetReadByData, UsersGetReadByVars, UsersGetVars, USERS_GET_QUERY, USERS_GET_READ_BY_QUERY } from './queries';
import { usersActions } from './slice';
import { chatActions } from '../chats/slice';

export const usersGetAsyncEpic: Epic<
   ReturnType<typeof usersActions.usersGetAsync>,
   any,
   RootState
> = action$ =>
  action$.pipe(
    debounceTime(500),
    ofType(usersActions.usersGetAsync.type),
    mergeMap(action =>
      from(
        client.query<UsersGetData, UsersGetVars>({
          query: USERS_GET_QUERY,
          variables: { input: action.payload },
        }),
      ).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e =>
              notificationsActions.addError(e.message),
            );
          return response.data.user.get.length < action.payload.take
            ? [
              usersActions.setHasNext(false),
              usersActions.addUsers(response.data.user.get),
            ]
            : [usersActions.addUsers(response.data.user.get)];
        }),
        catchError(error =>
          of(notificationsActions.addError(error.message)),
        ),
        startWith(usersActions.setUsersGetLoading(true)),
        endWith(usersActions.setUsersGetLoading(false)),
      ),
    ),
  );

export const readByGetAsyncEpic: Epic<ReturnType<typeof usersActions.readByGetAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    debounceTime(500),
    ofType(usersActions.readByGetAsync.type),
    mergeMap(action =>
      from(client.query<UsersGetReadByData, UsersGetReadByVars>({
        query: USERS_GET_READ_BY_QUERY,
        variables: action.payload,
      })).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e => notificationsActions.addError(e.message));
          return response.data.user.getReadBy.length < action.payload.take
            ? [
              usersActions.setReadByHasNext(false),
              chatActions.addReadBy({ messageId: action.payload.messageId, readBy: response.data.user.getReadBy }),
            ]
            : [chatActions.addReadBy({ messageId: action.payload.messageId, readBy: response.data.user.getReadBy })];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(usersActions.setUsersGetLoading(true)),
        endWith(usersActions.setUsersGetLoading(false)),
      ),
    ),
  );

export const userEpics = combineEpics(
  usersGetAsyncEpic,
  // @ts-ignore
  readByGetAsyncEpic,
);