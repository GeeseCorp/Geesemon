import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch, useAppSelector} from "./behavior/store";
import {Triangle} from "react-loader-spinner";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {Auth} from "./components/auth/Auth";
import "./App.css";
import {Notifications} from "./components/notifications/Notifications";
import {NavigateTo} from "./components/navigate/NavigateTo";
import {AuthedApp} from "./AuthedApp";
import {authActions} from "./behavior/features/auth/slice";

export const App = () => {
    const initialised = useAppSelector(s => s.app.initialised)
    const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const dispatch = useAppDispatch();
    const location = useLocation();
    // @ts-ignore
    const modal = location.state && location.state.modal;

    useEffect(() => {
        dispatch(authActions.meAsync());
    }, [dispatch]);

    if (isLoading || !initialised)
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