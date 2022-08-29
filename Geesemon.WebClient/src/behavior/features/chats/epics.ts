import {chatActions} from "./slice";
import {RootState} from "../../store";
import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, endWith, from, mergeMap, of, startWith} from "rxjs";
import {client} from "../../client";
import {
    CHATS_GET_QUERY,
    ChatsGetData,
    ChatsGetVars,
    MESSAGE_GET_QUERY,
    MessageGetData,
    MessageGetVars
} from "./queries";
import {notificationsActions} from "../notifications/slice";
import {
    CHAT_CREATE_GROUP_MUTATION,
    ChatCreateGroupData,
    ChatCreateGroupVars,
    MESSAGE_DELETE_MUTATION,
    MESSAGE_SEND_MUTATION,
    MessageDeleteData,
    MessageDeleteVars,
    MessageSendData,
    MessageSendVars
} from "./mutations";
import {Chat} from "./types";
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
            from(client.mutate<ChatCreateGroupData, ChatCreateGroupVars>({
                mutation: CHAT_CREATE_GROUP_MUTATION,
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
            from(client.mutate<MessageSendData, MessageSendVars>({
                mutation: MESSAGE_SEND_MUTATION,
                variables: {input: action.payload}
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const messageGetAsyncEpic: Epic<ReturnType<typeof chatActions.messageGetAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageGetAsync.type),
        mergeMap(action =>
            from(client.query<MessageGetData, MessageGetVars>({
                query: MESSAGE_GET_QUERY,
                variables: action.payload,
            })).pipe(
                mergeMap(response => [
                    chatActions.addMessages({
                        chatId: action.payload.chatId,
                        messages: response.data.message.get,
                    })
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setMessageGetLoading(true)),
                endWith(chatActions.setMessageGetLoading(false)),
            ),
        )
    );

export const messageDeleteAsyncEpic: Epic<ReturnType<typeof chatActions.messageDeleteAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageDeleteAsync.type),
        mergeMap(action =>
            from(client.mutate<MessageDeleteData, MessageDeleteVars>({
                mutation: MESSAGE_DELETE_MUTATION,
                variables: {input: action.payload}
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const chatEpics = combineEpics(
    getAsyncEpic,
    // @ts-ignore
    createGroupChatAsyncEpic,
    messageSendAsyncEpic,
    messageGetAsyncEpic,
    messageDeleteAsyncEpic,
)