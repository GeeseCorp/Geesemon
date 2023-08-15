import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authReducer } from './features/auth/slice';
import { notificationsReducer } from './features/notifications/slice';
import { chatReducer } from './features/chats';
import { usersReducer } from './features/users/slice';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { chatEpics } from './features/chats/epics';
import { navigateReducer } from './features/navigate/slice';
import { appReducer } from './features/app/slice';
import { authEpics } from './features/auth/epics';
import { userEpics } from './features/users/epics';
import { settingsEpics } from './features/settings/epics';
import { settingsReducer } from './features/settings/slice';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    chats: chatReducer,
    navigate: navigateReducer,
    settings: settingsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(epicMiddleware),
  devTools: true,
});

const rootEpic = combineEpics(
  chatEpics,
  // @ts-ignore
  authEpics,
  userEpics,
  settingsEpics,
);
// @ts-ignore
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
