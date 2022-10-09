import React, { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { LeftSidebar } from "./components/common/LeftSidebar/LeftSidebar";
import { useSubscription } from "@apollo/client";
import {
    MESSAGE_ACTIONS_SUBSCRIPTIONS,
    MessageActionsData,
    MessageActionsVars,
    CHAT_ACTIONS_SUBSCRIPTIONS,
    ChatActionsVars,
    ChatActionsData
} from "./behavior/features/chats/subscriptions";
import { ChatActionKind, MessageActionKind } from "./behavior/features/chats/types";
import { useAppDispatch, useAppSelector } from "./behavior/store";
import { chatActions } from "./behavior/features/chats";
import { useIsMobile } from "./hooks/useIsMobile";
import { ContentBar } from "./components/common/ContentBar/ContentBar";
import { RightSidebar } from "./components/common/RightSidebar/RightSidebar";
import { authActions } from './behavior/features/auth/slice';

type Props = {};
export const AuthedApp: FC<Props> = ({ }) => {
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible)
    const messageActionSubscription = useSubscription<MessageActionsData, MessageActionsVars>(MESSAGE_ACTIONS_SUBSCRIPTIONS);
    const chatActionSubscription = useSubscription<ChatActionsData, ChatActionsVars>(CHAT_ACTIONS_SUBSCRIPTIONS);

    const makeOfflineAsync = (e: BeforeUnloadEvent) => {
        dispatch(authActions.toggleOnlineAsync(false));
    }

    useEffect(() => {
        dispatch(authActions.toggleOnlineAsync(true));
        window.addEventListener("beforeunload", makeOfflineAsync);
        return () => {
            window.removeEventListener("beforeunload", makeOfflineAsync);
        }
    }, [])

    useEffect(() => {
        const data = messageActionSubscription.data;
        if (data) {
            switch (data?.messageActions.type) {
                case MessageActionKind.Create:
                    dispatch(chatActions.addMessages({
                        chatId: data.messageActions.message.chatId,
                        messages: [data.messageActions.message],
                    }))
                    break;
                case MessageActionKind.Update:
                    dispatch(chatActions.updateMessage(data.messageActions.message));
                    break;
                case MessageActionKind.Delete:
                    dispatch(chatActions.deleteMessage(data.messageActions.message))
                    break;
            }

        }
    }, [messageActionSubscription.data])

    useEffect(() => {
        const data = chatActionSubscription.data;
        if (data) {
            switch (data?.chatActions.type) {
                case ChatActionKind.Create:
                    dispatch(chatActions.addChats([data.chatActions.chat]))
                    break;
                case ChatActionKind.Update:
                    dispatch(chatActions.updateChat(data.chatActions.chat));
                    break;
                case ChatActionKind.Delete:
                    dispatch(chatActions.deleteChat(data.chatActions.chat.id))
                    break;
            }

        }
    }, [chatActionSubscription.data])

    return (
        <div className={'authedRoutes'}>
            {isMobile
                ? <Routes>
                    <Route path={'/'} element={<LeftSidebar />} />
                    <Route path={'/:chatId'} element={
                        isRightSidebarVisible
                            ? <RightSidebar />
                            : <ContentBar />
                    } />
                    <Route path={'/auth/*'} element={<Navigate to={'/'} />} />
                </Routes>
                : <>
                    <Routes>
                        <Route path={'/'} element={<LeftSidebar />} />
                        <Route path={'/:chatId'} element={<LeftSidebar />} />
                        <Route path={'/auth'} element={<Navigate to={'/'} />} />
                        <Route path={'/auth/*'} element={<Navigate to={'/'} />} />
                    </Routes>
                    <Routes>
                        <Route path={'/'} element={<ContentBar />} />
                        <Route path={'/:chatId'} element={<ContentBar />} />
                    </Routes>
                    <Routes>
                        <Route path={'/:chatId'} element={<RightSidebar />} />
                        <Route path={'*'} element={<RightSidebar />} />
                    </Routes>
                </>
            }
        </div>
    );
};