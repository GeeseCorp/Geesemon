import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./behavior/store";
import {me} from "./behavior/features/auth/thunks";
import {Triangle} from "react-loader-spinner";
import {Row} from "antd";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {Auth} from "./components/auth/Auth";
import {Messages} from "./components/messages/Messages/Messages";
import "./App.css";
import {Notifications} from "./components/notifications/Notifications";
import {ChatInfo} from "./components/chats/ChatInfo/ChatInfo";
import {Sidebar} from "./components/common/Sidebar/Sidebar";
import {ChatsCreateGroup} from "./components/chats/ChatsCreateGroup/ChatsCreateGroup";
import {ChatsCreateGroupMembers} from "./components/chats/ChatsCreateGroupMembers/ChatsCreateGroupMembers";
import {NavigateTo} from "./components/navigate/NavigateTo";

export const App = () => {
    const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const dispatch = useAppDispatch();
    const location = useLocation();
    // @ts-ignore
    const modal = location.state && location.state.modal;

    useEffect(() => {
        dispatch(me());
    }, [dispatch]);

    if (isLoading)
        return (
            <Triangle height={250} width={250} wrapperClass={'center'}/>
        );

    return (
        <div className={'wrapperApp'}>
            <div className={'app'}>
                <Row className={'innerApp'}>
                    <Notifications/>
                    <NavigateTo/>
                    {!isAuthorized
                        ? <Routes location={modal || location}>
                            <Route path="/auth/*" element={<Auth/>}/>
                            <Route path="*" element={<Navigate replace to="/auth"/>}/>
                        </Routes>
                        : <div className={'authedRoutes'}>
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
                    }
                </Row>
            </div>
        </div>
    );
}