import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./behavior/store";
import {me} from "./behavior/features/auth/thunks";
import {Triangle} from "react-loader-spinner";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {Auth} from "./components/auth/Auth";
import "./App.css";
import {Notifications} from "./components/notifications/Notifications";
import {NavigateTo} from "./components/navigate/NavigateTo";
import {AuthedApp} from "./AuthedApp";

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
                <Notifications/>
                <NavigateTo/>
                {!isAuthorized
                    ? <Routes location={modal || location}>
                        <Route path="/auth/*" element={<Auth/>}/>
                        <Route path="*" element={<Navigate replace to="/auth"/>}/>
                    </Routes>
                    : <AuthedApp/>
                }
            </div>
        </div>
    );
}