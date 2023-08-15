import { combineEpics, Epic, ofType } from 'redux-observable';
import {
  catchError,
  from,
  mergeMap,
  of,
} from 'rxjs';
import { client } from '../../client';
import { RootState } from '../../store';
import { notificationsActions } from '../notifications/slice';
import { GEESETEXTS_GET_QUERY, GeeseTextsGetData, LanguageGetData, LANGUAGES_GET_QUERY } from './queries';
import { settingsActions } from './slice';

export const languagesGetAsyncEpic: Epic<
   ReturnType<typeof settingsActions.getLanguagesAsync>,
   any,
   RootState
> = action$ =>
  action$.pipe(
    ofType(settingsActions.getLanguagesAsync.type),
    mergeMap(_ =>
      from(
        client.query<LanguageGetData>({
          query: LANGUAGES_GET_QUERY,
        }),
      ).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e =>
              notificationsActions.addError(e.message),
            );

          return [settingsActions.receiveLanguages(response.data.geeseTexts.getLanguages)];
        }),
        catchError(error =>
          of(notificationsActions.addError(error.message)),
        ),
      ),
    ),
  );

export const geeseTextsGetAsyncEpic: Epic<
ReturnType<typeof settingsActions.getGeeseTextsAsync>,
any,
RootState
> = action$ =>
  action$.pipe(
    ofType(settingsActions.getGeeseTextsAsync.type),
    mergeMap(_ =>
      from(
        client.query<GeeseTextsGetData>({
          query: GEESETEXTS_GET_QUERY,
        }),
      ).pipe(
        mergeMap(response => {
          if (response.errors?.length)
            return response.errors.map(e =>
              notificationsActions.addError(e.message),
            );

          return [settingsActions.receiveGeeseTexts(response.data.geeseTexts.getTexts)];
        }),
        catchError(error =>
          of(notificationsActions.addError(error.message)),
        ),
      ),
    ),
  );

export const settingsEpics = combineEpics(
  languagesGetAsyncEpic,
  geeseTextsGetAsyncEpic,
);