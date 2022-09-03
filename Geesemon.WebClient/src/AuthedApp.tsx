import React, {FC, useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useSearchParams} from "react-router-dom";
import {LeftSidebar} from "./components/common/LeftSidebar/LeftSidebar";
import {useSubscription} from "@apollo/client";
import {
    MESSAGE_ACTIONS_SUBSCRIPTIONS,
    MessageActionsData,
    MessageActionsVars
} from "./behavior/features/chats/subscriptions";
import {MessageActionKind} from "./behavior/features/chats/types";
import {useAppDispatch} from "./behavior/store";
import {chatActions} from "./behavior/features/chats";
import {useIsMobile} from "./hooks/useIsMobile";
import {ContentBar} from "./components/common/ContentBar/ContentBar";
import {RightSidebar} from "./components/common/RightSidebar/RightSidebar";

type Props = {};
export const AuthedApp: FC<Props> = ({}) => {
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const location = useLocation();
    // @ts-ignore
    const modal = location.state && location.state.modal;

    const messageActionSubscription = useSubscription<MessageActionsData, MessageActionsVars>(MESSAGE_ACTIONS_SUBSCRIPTIONS);

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

    return (
        <div className={'authedRoutes'}>
            {isMobile
                ? <Routes location={modal || location}>
                    <Route path={'/'} element={<LeftSidebar/>}/>
                    <Route path={'/:chatId'} element={<ContentBar/>}/>
                    <Route path={'/auth'} element={<Navigate to={'/'}/>}/>
                </Routes>
                : <>
                    <Routes location={modal || location}>
                        <Route path={'/'} element={<LeftSidebar/>}/>
                        <Route path={'/:chatId'} element={<LeftSidebar/>}/>
                        <Route path={'/auth'} element={<Navigate to={'/'}/>}/>
                    </Routes>
                    <Routes location={modal || location}>
                        <Route path={'/'} element={<div className={'center'}>Select a chat</div>}/>
                        <Route path={'/:chatId'} element={<ContentBar/>}/>
                        <Route path={'/auth'} element={<Navigate to={'/'}/>}/>
                    </Routes>

                    <RightSidebar/>
                    {/*{modal &&*/}
                    {/*    <Routes>*/}
                    {/*        <Route path={'/create-group-chat'} element={<ChatsCreateGroup/>}/>*/}
                    {/*        <Route path={'/create-group-chat/members'} element={<ChatsCreateGroupMembers/>}/>*/}
                    {/*    </Routes>*/}
                    {/*}*/}
                </>
            }

        </div>
    );
};