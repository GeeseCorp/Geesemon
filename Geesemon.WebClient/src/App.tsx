import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./behavior/store";
import {me} from "./behavior/features/auth/thunks";
import {Triangle} from "react-loader-spinner";
import {Col, Row} from "antd";
import {Navigate, Route, Routes} from "react-router-dom";
import {Chats} from "./components/chats/Chats/Chats";
import {Auth} from "./components/auth/Auth";
import {Messages} from "./components/messages/Messages/Messages";
import "./App.css";
import {Notifications} from "./components/notifications/Notifications";
import {ChatInfo} from "./components/chats/ChatInfo/ChatInfo";

export const App = () => {
    let isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
    let isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const dispatch = useAppDispatch();

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
                    {!isAuthorized
                        ? <Routes>
                            <Route path="/auth/*" element={<Auth/>}/>
                            <Route path="*" element={<Navigate replace to="/auth"/>}/>
                        </Routes>
                        :
                        <>
                            <Col span={6}>
                                <Routes>
                                    <Route path={'/'} element={<Chats/>}/>
                                    <Route path={'/:chatId'} element={<Chats/>}/>
                                    <Route path={'/settings'} element={<div>settings</div>}/>
                                    <Route path={'/auth'} element={<Navigate to={'/'}/>}/>
                                </Routes>
                            </Col>
                            <Col span={18}>
                                <Routes>
                                    <Route path={'/'} element={<div className={'center'}>Select a chat</div>}/>
                                    <Route path={'/:chatId'} element={
                                        <>
                                            <ChatInfo/>
                                            <Messages/>
                                        </>
                                    }/>
                                </Routes>
                            </Col>
                        </>
                    }
                </Row>
            </div>
        </div>
    );
}