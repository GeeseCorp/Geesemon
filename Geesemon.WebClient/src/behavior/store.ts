import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authReducer} from "./features/auth/slice";
import notificationsReducer from "./features/notifications/notificationsSlice";
import {chatReducer} from "./features/chats";
import {usersReducer} from "./features/users/slice";
import {messagesReducer} from "./features/messages/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    chats: chatReducer,
    messages: messagesReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
