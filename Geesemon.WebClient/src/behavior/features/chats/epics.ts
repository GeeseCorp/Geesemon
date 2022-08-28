import {chatActions} from "./slice";
import {RootState} from "../../store";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, from, mergeMap, of} from "rxjs";
import client from "../../client";
import {CHATS_GET_QUERY, ChatsGetData, ChatsGetVars} from "./queries";
import {notificationsActions} from "../notifications/slice";
import {
    CHATS_CREATE_GROUP_MUTATION,
    ChatsCreateGroupData,
    ChatsCreateGroupVars,
    MESSAGES_SEND_MUTATION,
    MessagesSendData,
    MessagesSendVars
} from "./mutations";
import {Chat, Message} from "./types";
import {navigateActions} from "../navigate/slice";

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

export const createGroupChatAsyncEpic: Epic<ReturnType<typeof chatActions.createGroupChatAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.createGroupChatAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatsCreateGroupData, ChatsCreateGroupVars>({
                mutation: CHATS_CREATE_GROUP_MUTATION,
                variables: {input: action.payload}
            })).pipe(
                mergeMap(response => [
                    chatActions.addChats([response.data?.chat.createGroup as Chat]),
                    navigateActions.navigate(-2),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const messageSendAsyncEpic: Epic<ReturnType<typeof chatActions.messageSendAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageSendAsync.type),
        mergeMap(action =>
            from(client.mutate<MessagesSendData, MessagesSendVars>({
                mutation: MESSAGES_SEND_MUTATION,
                variables: {input: action.payload}
            })).pipe(
                mergeMap(response => [
                    // chatActions.addMessagesInEnd({
                    //     chatId: action.payload.chatId,
                    //     messages: [response.data?.message.send as Message],
                    // }),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const chatEpics = combineEpics(
    getAsyncEpic,
    // @ts-ignore
    createGroupChatAsyncEpic,
    messageSendAsyncEpic,
)