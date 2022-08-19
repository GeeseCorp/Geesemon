import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import testReducer from "./test/testSlice";
import userReducer from "./auth/userSlice";
import notificationsReducer from "./notifications/notificationsSlice";
import userListReducer from "./userList/userListSlice";
import chatReducer from "./chat/chatSlice";

export const store = configureStore({
  reducer: {
    test: testReducer,
    user: userReducer,
    userList: userListReducer,
    notifications: notificationsReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
