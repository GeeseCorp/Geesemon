import {chatActions} from "./slice";
import {RootState} from "../../store";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, from, mergeMap, of} from "rxjs";
import client from "../../client";
import {CHATS_GET_QUERY, ChatsGetData, ChatsGetVars} from "./queries";
import {notificationsActions} from "../notifications/slice";

export const getAsyncEpic: Epic<ReturnType<typeof chatActions.getAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.getAsync.type),
        mergeMap(action =>
            from(client.query<ChatsGetData, ChatsGetVars>({
                query: CHATS_GET_QUERY,
                variables: {}
            })).pipe(
                mergeMap(response => [
                    chatActions.addChats(response.data.chat.get),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const chatEpics = combineEpics(
    getAsyncEpic,
)