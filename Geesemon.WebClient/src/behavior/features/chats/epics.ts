import { combineEpics, Epic, ofType } from 'redux-observable';
import { catchError, endWith, from, iif, map, mergeMap, of, startWith, tap } from 'rxjs';
import { isGuidEmpty } from '../../../utils/stringUtils';
import { client } from '../../client';
import { RootState } from '../../store';
import { appActions, LeftSidebarState, RightSidebarState } from '../app/slice';
import { navigateActions } from '../navigate/slice';
import { notificationsActions } from '../notifications/slice';
import {
    ChatAddMembersData,
    ChatAddMembersVars,
    ChatCreateGroupData,
    ChatCreateGroupVars, ChatCreatePersonalData,
    ChatCreatePersonalVars, ChatDeleteData,
    ChatDeleteVars, ChatRemoveMembersData, ChatRemoveMembersVars, ChatUpdateData, ChatUpdateVars, CHAT_ADD_MEMBERS_MUTATION, CHAT_CREATE_GROUP_MUTATION, CHAT_CREATE_PERSONAL_MUTATION, CHAT_DELETE_MUTATION, CHAT_REMOVE_MEMBERS_MUTATION, CHAT_UPDATE_GROUP_MUTATION, MessageDeleteData,
    MessageDeleteVars, MessageMakeReadData,
    MessageMakeReadVars, MessageSendData,
    MessageSendVars,
    MessageUpdateData,
    MessageUpdateVars, MESSAGE_DELETE_MUTATION, MESSAGE_MAKE_READ_MUTATION, MESSAGE_SEND_MUTATION,
    MESSAGE_UPDATE_MUTATION,
} from './mutations';
import {
    ChatsGetByIdentifierData,
    ChatsGetByIdentifierVars,
    ChatsGetData,
    ChatsGetVars, CHATS_GET_BY_IDENTIFIER_QUERY, CHATS_GET_QUERY, MessageGetData,
    MessageGetVars, MESSAGE_GET_QUERY,
} from './queries';
import { chatActions } from './slice';

export const chatsGetAsyncEpic: Epic<ReturnType<typeof chatActions.chatsGetAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatsGetAsync.type),
        mergeMap(action =>
            from(client.query<ChatsGetData, ChatsGetVars>({
                query: CHATS_GET_QUERY,
                variables: action.payload,
            })).pipe(
                mergeMap(response => response.data.chat.get.length < action.payload.take
                    ? [
                        chatActions.setChatsGetHasNext(false),
                        chatActions.addChats(response.data.chat.get),
                    ]
                    : [chatActions.addChats(response.data.chat.get)],
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setChatsGetLoading(true)),
                endWith(chatActions.setChatsGetLoading(false)),
            ),
        ),
    );

export const chatGetByIdentifierAsyncEpic: Epic<ReturnType<typeof chatActions.chatGetByIdentifierAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatGetByIdentifierAsync.type),
        mergeMap(action =>
            from(client.query<ChatsGetByIdentifierData, ChatsGetByIdentifierVars>({
                query: CHATS_GET_BY_IDENTIFIER_QUERY,
                variables: { identifier: action.payload },
            })).pipe(
                mergeMap(response => {
                    if (!response.data.chat.getByIdentifier)
                        return [
                            notificationsActions.addError('Chat not found'),
                            navigateActions.navigate(-1),
                        ];
                    return [
                        chatActions.setChatByIdentifier(response.data.chat.getByIdentifier),
                    ];
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setChatGetByIdentifierLoading(true)),
                endWith(chatActions.setChatGetByIdentifierLoading(false)),
            ),
        ),
    );

export const createGroupChatAsyncEpic: Epic<ReturnType<typeof chatActions.createGroupChatAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.createGroupChatAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatCreateGroupData, ChatCreateGroupVars>({
                mutation: CHAT_CREATE_GROUP_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => [
                    // chatActions.addChats([response.data?.chat.createGroup as Chat]),
                    appActions.setLeftSidebarState(LeftSidebarState.Chats),
                    navigateActions.navigate(`./${response.data?.chat.createGroup.identifier}`),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setCreateGroupLoading(true)),
                endWith(chatActions.setCreateGroupLoading(false)),
            ),
        ),
    );

export const createPersonalChatAsyncEpic: Epic<ReturnType<typeof chatActions.createPersonalChatAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.createPersonalChatAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatCreatePersonalData, ChatCreatePersonalVars>({
                mutation: CHAT_CREATE_PERSONAL_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => [
                    // chatActions.addChats([response.data?.chat.createGroup as Chat]),
                    appActions.setLeftSidebarState(LeftSidebarState.Chats),
                    navigateActions.navigate(`./${response.data?.chat.createPersonal.identifier}`),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setCreateGroupLoading(true)),
                endWith(chatActions.setCreateGroupLoading(false)),
            ),
        ),
    );

export const chatDeleteAsyncEpic: Epic<ReturnType<typeof chatActions.chatDeleteAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatDeleteAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatDeleteData, ChatDeleteVars>({
                mutation: CHAT_DELETE_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            ),
        ),
    );

export const messageSendAsyncEpic: Epic<ReturnType<typeof chatActions.messageSendAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageSendAsync.type),
        mergeMap(action =>
            isGuidEmpty(action.payload.chatId)
                ? from(client.mutate<ChatCreatePersonalData, ChatCreatePersonalVars>({
                    mutation: CHAT_CREATE_PERSONAL_MUTATION,
                    variables: { input: { identifier: action.payload.sentMessageInput.identifier } },
                })).pipe(
                    mergeMap(response =>
                        from(client.mutate<MessageSendData, MessageSendVars>({
                            mutation: MESSAGE_SEND_MUTATION,
                            variables: { input: action.payload.sentMessageInput },
                        })).pipe(
                            mergeMap(response => []),
                            catchError(error => of(notificationsActions.addError(error.message))),
                        ),
                    ),
                )
                : from(client.mutate<MessageSendData, MessageSendVars>({
                    mutation: MESSAGE_SEND_MUTATION,
                    variables: { input: action.payload.sentMessageInput },
                })).pipe(
                    mergeMap(response => []),
                    catchError(error => of(notificationsActions.addError(error.message))),
                ),
        ),
    );

export const messageUpdateAsyncEpic: Epic<ReturnType<typeof chatActions.messageUpdateAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageUpdateAsync.type),
        mergeMap(action =>
            from(client.mutate<MessageUpdateData, MessageUpdateVars>({
                mutation: MESSAGE_UPDATE_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            ),
        ),
    );

export const messageGetAsyncEpic: Epic<ReturnType<typeof chatActions.messageGetAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageGetAsync.type),
        mergeMap(action =>
            from(client.query<MessageGetData, MessageGetVars>({
                query: MESSAGE_GET_QUERY,
                variables: action.payload,
            })).pipe(
                mergeMap(response => response.data.message.get.length < action.payload.take
                    ? [
                        chatActions.setMessagesGetHasNext(false),
                        chatActions.addInEndMessages({
                            chatId: action.payload.chatId,
                            messages: response.data.message.get,
                        }),
                    ]
                    : [chatActions.addInEndMessages({
                        chatId: action.payload.chatId,
                        messages: response.data.message.get,
                    })],
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setMessageGetLoading(true)),
                endWith(chatActions.setMessageGetLoading(false)),
            ),
        ),
    );

export const messageDeleteAsyncEpic: Epic<ReturnType<typeof chatActions.messageDeleteAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageDeleteAsync.type),
        mergeMap(action =>
            from(client.mutate<MessageDeleteData, MessageDeleteVars>({
                mutation: MESSAGE_DELETE_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            ),
        ),
    );

export const messageMakeReadAsyncEpic: Epic<ReturnType<typeof chatActions.messageMakeReadAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.messageMakeReadAsync.type),
        mergeMap(action =>
            from(client.mutate<MessageMakeReadData, MessageMakeReadVars>({
                mutation: MESSAGE_MAKE_READ_MUTATION,
                variables: { messageId: action.payload.messageId },
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            ),
        ),
    );

export const chatAddMembersAsyncEpic: Epic<ReturnType<typeof chatActions.chatAddMembersAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatAddMembersAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatAddMembersData, ChatAddMembersVars>({
                mutation: CHAT_ADD_MEMBERS_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setChatAddMembersLoading(true)),
                endWith(chatActions.setChatAddMembersLoading(false)),
            ),
        ),
    );

export const chatRemoveMembersAsyncEpic: Epic<ReturnType<typeof chatActions.chatRemoveMembersAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.chatRemoveMembersAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatRemoveMembersData, ChatRemoveMembersVars>({
                mutation: CHAT_REMOVE_MEMBERS_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => []),
                catchError(error => of(notificationsActions.addError(error.message))),
            ),
        ),
    );

    export const updateChatAsyncEpic: Epic<ReturnType<typeof chatActions.updateChatAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(chatActions.updateChatAsync.type),
        mergeMap(action =>
            from(client.mutate<ChatUpdateData, ChatUpdateVars>({
                mutation: CHAT_UPDATE_GROUP_MUTATION,
                variables: { input: action.payload },
            })).pipe(
                mergeMap(response => [
                    appActions.setRightSidebarState(RightSidebarState.Profile),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(chatActions.setUpdateChatLoading(true)),
                endWith(chatActions.setUpdateChatLoading(false)),
            ),
        ),
    );

export const chatEpics = combineEpics(
    chatsGetAsyncEpic,
    // @ts-ignore
    chatGetByIdentifierAsyncEpic,
    createGroupChatAsyncEpic,
    createPersonalChatAsyncEpic,
    chatDeleteAsyncEpic,
    messageSendAsyncEpic,
    messageUpdateAsyncEpic,
    messageGetAsyncEpic,
    messageDeleteAsyncEpic,
    messageMakeReadAsyncEpic,
    chatAddMembersAsyncEpic,
    chatRemoveMembersAsyncEpic,
    updateChatAsyncEpic,
);