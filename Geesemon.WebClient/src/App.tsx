import {useEffect} from "react";
import "./App.css";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./behavior/store";
import {me} from "./behavior/features/auth/thunk";
import {Triangle} from "react-loader-spinner";

import styles from "./components/common/styles/site.module.css";
import {Col, Row} from "antd";
import {Navigate, Route, Routes} from "react-router-dom";
import {Chats} from "./components/chats/Chats/Chats";
import {AuthLayout} from "./components/Auth/AuthLayout";
import {Messages} from "./components/messages/Messages/Messages";

export const App = () => {
    let isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
    let isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(me());
    }, [dispatch]);

    if (isLoading)
        return (
            <Triangle height={250} width={250} wrapperClass={styles.screenCenter}/>
        );

    if (!isAuthorized)
        return (
            <Routes>
                <Route path="/auth/*" element={<AuthLayout/>}/>
                <Route path="*" element={<Navigate replace to="/auth"/>}/>
            </Routes>
        );

    return (
        <Row className={'wrapperApp'}>
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
                    <Route path={'/'} element={<div>Select a chat</div>}/>
                    <Route path={'/:chatId'} element={<Messages/>}/>
                </Routes>
            </Col>
        </Row>
    );
}