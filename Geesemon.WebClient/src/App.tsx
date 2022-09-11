import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import { AuthedApp } from "./AuthedApp";
import { appActions } from "./behavior/features/app/slice";
import { authActions } from "./behavior/features/auth/slice";
import { RootState, useAppDispatch, useAppSelector } from "./behavior/store";
import { Login } from "./components/auth/Login/Login";
import { Register } from "./components/auth/Register/Register";
import { BigLoading } from "./components/common/BigLoading/BigLoading";
import { NavigateTo } from "./components/navigate/NavigateTo";
import { Notifications } from "./components/notifications/Notifications";
import { getAuthToken } from "./utils/localStorageUtils";

export const App = () => {
    const initialised = useAppSelector(s => s.app.initialised)
    const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
    const meLoading = useSelector((state: RootState) => state.auth.meLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (getAuthToken())
            dispatch(authActions.meAsync());
        else
            dispatch(appActions.setInitialised(true));
    }, [dispatch]);

    return (
        <div className={'wrapperApp'}>
            {meLoading || !initialised
                ? <BigLoading />
                : <div className={'app'}>
                    <Notifications />
                    <NavigateTo />
                    {!isAuthorized
                        ? <Routes>
                            <Route path="/auth/login" element={<Login />} />
                            <Route path="/auth/register" element={<Register />} />
                            <Route path="*" element={<Navigate replace to="/auth/login" />} />
                        </Routes>
                        : <AuthedApp />
                    }
                </div>
            }
        </div>
    );
}