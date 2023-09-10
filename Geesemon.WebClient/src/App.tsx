import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import { AuthedApp } from './AuthedApp';
import { appActions } from './behavior/features/app/slice';
import { authActions } from './behavior/features/auth/slice';
import { RootState, useAppDispatch, useAppSelector } from './behavior/store';
import { Login } from './components/auth/Login/Login';
import { LoginViaQrCode } from './components/auth/LoginViaQrCode/LoginViaQrCode';
import { Register } from './components/auth/Register/Register';
import { BigLoading } from './components/common/BigLoading/BigLoading';
import { NavigateTo } from './components/navigate/NavigateTo';
import { Notifications } from './components/notifications/Notifications';
import { useCookies } from 'react-cookie';
import { settingsActions } from './behavior/features/settings/slice';
import { localStorageGetItem } from './utils/localStorageUtils';
import { UnauthedApp } from './UnauthedApp';

export const App = () => {
  const initialised = useAppSelector(s => s.app.initialised);
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  const meLoading = useSelector((state: RootState) => state.auth.meLoading);
  const dispatch = useAppDispatch();

  const [LangCookie, setCookie] = useCookies(['lang']);

  if (!LangCookie || !LangCookie.lang)
    setCookie('lang', 'EN', { path: '/' });

  useEffect(() => {
    if (localStorageGetItem('AuthToken'))
      dispatch(authActions.meAsync());
    else
      dispatch(appActions.setInitialised(true));

    dispatch(settingsActions.getGeeseTextsAsync());
  }, [dispatch]);

  return (
    <div className={'wrapperApp'}>
      {meLoading || !initialised
        ? <BigLoading />
        : (
          <div className={'app'}>
            <Notifications />
            <NavigateTo />
            {isAuthorized ? <AuthedApp /> : <UnauthedApp />}
          </div>
        )
      }
    </div>
  );
};