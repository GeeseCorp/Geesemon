import { useSubscription } from '@apollo/client';
import { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authActions } from './behavior/features/auth/slice';
import { chatActions } from './behavior/features/chats';
import {
    ChatActionsData, ChatActionsVars, CHAT_ACTIONS_SUBSCRIPTIONS, MessageActionsData,
    MessageActionsVars, MESSAGE_ACTIONS_SUBSCRIPTIONS
} from './behavior/features/chats/subscriptions';
import {
    ChatActionKind,
    MessageActionKind
} from './behavior/features/chats/types';
import { useAppDispatch, useAppSelector } from './behavior/store';
import { ContentBar } from './components/common/ContentBar/ContentBar';
import { LeftSidebar } from './components/common/LeftSidebar/LeftSidebar';
import { RightSidebar } from './components/common/RightSidebar/RightSidebar';
import { useIsMobile } from './hooks/useIsMobile';

export const AuthedApp: FC = () => {
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const isRightSidebarVisible = useAppSelector(s => s.app.isRightSidebarVisible);
    const messageActionSubscription = useSubscription<MessageActionsData, MessageActionsVars>(MESSAGE_ACTIONS_SUBSCRIPTIONS);
    const chatActionSubscription = useSubscription<ChatActionsData, ChatActionsVars>(CHAT_ACTIONS_SUBSCRIPTIONS);

    const makeOfflineAsync = () => {
        dispatch(authActions.toggleOnlineAsync(false));
    };

    useEffect(() => {
        dispatch(authActions.toggleOnlineAsync(true));
        window.addEventListener('beforeunload', makeOfflineAsync);
        return () => {
        window.removeEventListener('beforeunload', makeOfflineAsync);
        };
    }, []);

    useEffect(() => {
        const data = messageActionSubscription.data;
        if (data) {
            switch (data?.messageActions.type) {
                case MessageActionKind.Create:
                    dispatch(
                        chatActions.addMessages({
                        chatId: data.messageActions.message.chatId,
                        messages: [data.messageActions.message],
                        }),
                    );
                    break;
                case MessageActionKind.Update:
                    dispatch(chatActions.updateMessage(data.messageActions.message));
                    break;
                case MessageActionKind.Delete:
                    dispatch(chatActions.deleteMessage(data.messageActions.message));
                    break;
            }
        }
    }, [messageActionSubscription.data, dispatch]);

    useEffect(() => {
        const data = chatActionSubscription.data;
        if (data) {
            switch (data?.chatActions.type) {
                case ChatActionKind.Create:
                    dispatch(chatActions.addChats([data.chatActions.chat]));
                    break;
                case ChatActionKind.Update:
                    dispatch(chatActions.updateChat(data.chatActions.chat));
                    break;
                case ChatActionKind.Delete:
                    dispatch(chatActions.deleteChat(data.chatActions.chat.id));
                    break;
            }
        }
    }, [chatActionSubscription.data, dispatch]);

    return (
        <div className={'authedRoutes'}>
        {isMobile ? (
            <Routes>
            <Route path={'/'} element={<LeftSidebar />} />
            <Route
                path={'/:chatUsername'}
                element={isRightSidebarVisible ? <RightSidebar /> : <ContentBar />}
            />
            <Route path={'/auth/*'} element={<Navigate to={'/'} />} />
            </Routes>
        ) : (
            <>
            <Routes>
                <Route path={'/'} element={<LeftSidebar />} />
                <Route path={'/:chatUsername'} element={<LeftSidebar />} />
                <Route path={'/auth'} element={<Navigate to={'/'} />} />
                <Route path={'/auth/*'} element={<Navigate to={'/'} />} />
            </Routes>
            <Routes>
                <Route path={'/'} element={<ContentBar />} />
                <Route path={'/:chatUsername'} element={<ContentBar />} />
            </Routes>
            <Routes>
                <Route path={'/:chatUsername'} element={<RightSidebar />} />
                <Route path={'*'} element={<RightSidebar />} />
            </Routes>
            </>
        )}
        </div>
    );
};
