import React, {FC, useEffect} from 'react';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {Sidebar} from "./components/common/Sidebar/Sidebar";
import {ChatInfo} from "./components/chats/ChatInfo/ChatInfo";
import {Messages} from "./components/messages/Messages/Messages";
import {ChatsCreateGroup} from "./components/chats/ChatsCreateGroup/ChatsCreateGroup";
import {ChatsCreateGroupMembers} from "./components/chats/ChatsCreateGroupMembers/ChatsCreateGroupMembers";
import {useSubscription} from "@apollo/client";
import {
    MESSAGE_ACTIONS_SUBSCRIPTIONS,
    MessageActionsData,
    MessageActionsVars
} from "./behavior/features/chats/subscriptions";
import {MessageActionKind} from "./behavior/features/chats/types";
import {useAppDispatch} from "./behavior/store";
import {chatActions} from "./behavior/features/chats";

type Props = {};
export const AuthedApp: FC<Props> = ({}) => {
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
                case MessageActionKind.Delete:
                    dispatch(chatActions.deleteMessage(data.messageActions.message))
                    break;
            }

        }
    }, [messageActionSubscription.data])

    return (
        <div className={'authedRoutes'}>
            <Routes location={modal || location}>
                <Route path={'/'} element={<Sidebar/>}/>
                <Route path={'/:chatId'} element={<Sidebar/>}/>
                <Route path={'/auth'} element={<Navigate to={'/'}/>}/>
            </Routes>
            <div className={'messages'}>
                <Routes location={modal || location}>
                    <Route path={'/'} element={<div className={'center'}>Select a chat</div>}/>
                    <Route path={'/:chatId'} element={
                        <>
                            <ChatInfo/>
                            <Messages/>
                        </>
                    }/>
                </Routes>
            </div>
            {modal &&
                <Routes>
                    <Route path={'/create-group-chat'} element={<ChatsCreateGroup/>}/>
                    <Route path={'/create-group-chat/members'} element={<ChatsCreateGroupMembers/>}/>
                </Routes>
            }
        </div>
    );
};