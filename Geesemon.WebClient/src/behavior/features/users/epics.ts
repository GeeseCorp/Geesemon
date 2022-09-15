import { combineEpics, Epic, ofType } from "redux-observable";
import { catchError, endWith, from, mergeMap, of, startWith } from "rxjs";
import { client } from "../../client";
import { RootState } from "../../store";
import { notificationsActions } from "../notifications/slice";
import { UsersGetData, UsersGetVars, USERS_GET_QUERY } from "./queries";
import { usersActions } from "./slice";

export const usersGetAsyncEpic: Epic<ReturnType<typeof usersActions.usersGetAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(usersActions.usersGetAsync.type),
        mergeMap(action =>
            from(client.query<UsersGetData, UsersGetVars>({
                query: USERS_GET_QUERY,
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => {
                    if (response.errors?.length)
                        return response.errors.map(e => notificationsActions.addError(e.message));
                    return [
                        usersActions.addUsers(response.data.user.get),
                    ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(usersActions.setUsersGetLoading(true)),
                endWith(usersActions.setUsersGetLoading(false)),
            )
        )
    );

export const userEpics = combineEpics(
    usersGetAsyncEpic,
)