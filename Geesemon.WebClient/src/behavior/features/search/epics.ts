import { combineEpics, Epic, ofType } from 'redux-observable';
import { catchError, debounceTime, endWith, from, of, startWith, switchMap } from 'rxjs';
import { client } from '../../client';
import { RootState } from '../../store';
import { notificationsActions } from '../notifications/slice';
import { searchActions } from './slice';
import { searchChatsQuery } from './queries';

export const chatsGetAsyncEpic: Epic<ReturnType<typeof searchActions.chatsGetAsync>, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(searchActions.chatsGetAsync.type),
    debounceTime(250),
    switchMap(action =>
      from(client.query({
        query: searchChatsQuery,
        variables: action.payload,
      })).pipe(
        switchMap(response => {
          const chats = response.data.search.chats;

          return chats.length < action.payload.paging.take
            ? [
              searchActions.setChatsGetHasNext(false),
              searchActions.addChats(chats),
            ]
            : [searchActions.addChats(chats)];
        }),
        catchError(error => of(notificationsActions.addError(error.message))),
        startWith(searchActions.setChatsGetLoading(true)),
        endWith(searchActions.setChatsGetLoading(false)),
      ),
    ),
  );

export const searchEpics = combineEpics(
  chatsGetAsyncEpic,
);
