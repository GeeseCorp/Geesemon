import { chatActions } from "./slice";
import { RootState } from "../../store";
import { combineEpics, Epic, ofType } from "redux-observable";
import { catchError, endWith, from, mergeMap, of, startWith } from "rxjs";
import { client } from "../../client";
import {
    CHATS_GET_QUERY,
    ChatsGetData,
    ChatsGetVars,
    MESSAGE_GET_QUERY,
    MessageGetData,
    MessageGetVars
} from "./queries";
import { notificationsActions } from "../notifications/slice";
import {
    CHAT_CREATE_GROUP_MUTATION,
    ChatCreateGroupData,
    ChatCreateGroupVars,
    MESSAGE_DELETE_MUTATION,
    MESSAGE_SEND_MUTATION,
    MESSAGE_UPDATE_MUTATION,
    MessageDeleteData,
    MessageDeleteVars,
    MessageSendData,
    MessageSendVars,
    MessageUpdateData,
    MessageUpdateVars,
    CHAT_DELETE_MUTATION,
    ChatDeleteData,
    ChatDeleteVars,
    CHAT_CREATE_PERSONAL_MUTATION,
    ChatCreatePersonalData,
    ChatCreatePersonalVars,
    MessageMakeReadData,
    MessageMakeReadVars,
    MESSAGE_MAKE_READ_MUTATION
} from "./mutations";
import { Chat } from "./types";
import { appActions, LeftSidebarState } from "../app/slice";
import { navigateActions } from '../navigate/slice';

export const chatsGetAsyncEpic: Epic<ReturnType<typeof chatActions.chatsGetAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatsGetAsync.type),
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
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => [
                    // chatActions.addChats([response.data?.chat.createGroup as Chat]),
                    appActions.setLeftSidebarState(LeftSidebarState.Chats),
                    navigateActions.navigate(`./${response.data?.chat.createGroup.id}`),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setCreateGroupLoading(true)),
                endWith(chatActions.setCreateGroupLoading(false)),
            )
        )
    );


export const createPersonalChatAsyncEpic: Epic<ReturnType<typeof chatActions.createPersonalChatAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.createPersonalChatAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatCreatePersonalData, ChatCreatePersonalVars>({
                mutation: CHAT_CREATE_PERSONAL_MUTATION,
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => [
                    // chatActions.addChats([response.data?.chat.createGroup as Chat]),
                    appActions.setLeftSidebarState(LeftSidebarState.Chats),
                    navigateActions.navigate(`./${response.data?.chat.createPersonal.id}`),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setCreateGroupLoading(true)),
                endWith(chatActions.setCreateGroupLoading(false)),
            )
        )
    );

export const chatDeleteAsyncEpic: Epic<ReturnType<typeof chatActions.chatDeleteAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatDeleteAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatDeleteData, ChatDeleteVars>({
                mutation: CHAT_DELETE_MUTATION,
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => []),
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
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const messageUpdateAsyncEpic: Epic<ReturnType<typeof chatActions.messageUpdateAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageUpdateAsync.type),
        mergeMap(action =>
            from(client.mutate<MessageUpdateData, MessageUpdateVars>({
                mutation: MESSAGE_UPDATE_MUTATION,
                variables: { input: action.payload }
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
                variables: { input: action.payload }
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const messageMakeReadAsyncEpic: Epic<ReturnType<typeof chatActions.messageMakeReadAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageMakeReadAsync.type),
        mergeMap(action =>
            from(client.mutate<MessageMakeReadData, MessageMakeReadVars>({
                mutation: MESSAGE_MAKE_READ_MUTATION,
                variables: { messageId: action.payload.messageId }
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const chatEpics = combineEpics(
    chatsGetAsyncEpic,
    // @ts-ignore
    createGroupChatAsyncEpic,
    createPersonalChatAsyncEpic,
    chatDeleteAsyncEpic,
    messageSendAsyncEpic,
    messageUpdateAsyncEpic,
    messageGetAsyncEpic,
    messageDeleteAsyncEpic,
    messageMakeReadAsyncEpic,
)