import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./behavior/store";
import {me} from "./behavior/features/auth/thunks";
import {Triangle} from "react-loader-spinner";
import {Col, Row} from "antd";
import {Navigate, Route, Routes} from "react-router-dom";
import {Auth} from "./components/auth/Auth";
import {Messages} from "./components/messages/Messages/Messages";
import "./App.css";
import {Notifications} from "./components/notifications/Notifications";
import {ChatInfo} from "./components/chats/ChatInfo/ChatInfo";
import {Sidebar} from "./components/common/Sidebar/Sidebar";

export const App = () => {
    const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
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
                        : <div className={'authedRoutes'}>
                                <Routes>
                                    <Route path={'/'} element={<Sidebar/>}/>
                                    <Route path={'/:chatId'} element={<Sidebar/>}/>
                                    <Route path={'/auth'} element={<Navigate to={'/'}/>}/>
                                </Routes>
                                <div className={'messages'}>
                                    <Routes>
                                        <Route path={'/'} element={<div className={'center'}>Select a chat</div>}/>
                                        <Route path={'/:chatId'} element={
                                            <>
                                                <ChatInfo/>
                                                <Messages/>
                                            </>
                                        }/>
                                    </Routes>
                                </div>
                        </div>
                    }
                </Row>
            </div>
        </div>
    );
}