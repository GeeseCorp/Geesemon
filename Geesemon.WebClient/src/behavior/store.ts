import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authReducer} from "./features/auth/slice";
import {notificationsReducer} from "./features/notifications/slice";
import {chatReducer} from "./features/chats";
import {usersReducer} from "./features/users/slice";
import {combineEpics, createEpicMiddleware} from "redux-observable";
import {chatEpics} from "./features/chats/epics";
import {navigateReducer} from "./features/navigate/slice";
import {appReducer} from "./features/app/slice";
import {authEpics} from "./features/auth/epics";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        users: usersReducer,
        notifications: notificationsReducer,
        chats: chatReducer,
        navigate: navigateReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({thunk: true}).concat(epicMiddleware),
    devTools: true,
});

const rootEpic = combineEpics(
    chatEpics,
    // @ts-ignore
    authEpics,
);
// @ts-ignore
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
