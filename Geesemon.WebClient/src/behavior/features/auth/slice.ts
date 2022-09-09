import { AuthResponseType, User } from "./types";
import { createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { LoginInputType, RegisterInputType } from "./mutations";
import { removeAuthToken, setAuthToken } from "../../../utils/localStorageUtils";

type InitialState = {
    authedUser?: User | null
    isAuthorized: boolean
    meLoading: boolean
    loginLoading: boolean
    registerLoading: boolean
};

const initialState: InitialState = {
    isAuthorized: false,
    authedUser: null,
    meLoading: false,
    loginLoading: false,
    registerLoading: false,
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        meAsync: (state: InitialState, action: PayloadAction) => state,
        loginAsync: (state: InitialState, action: PayloadAction<LoginInputType>) => state,
        registerAsync: (state: InitialState, action: PayloadAction<RegisterInputType>) => state,
        login: (state: InitialState, action: PayloadAction<AuthResponseType>) => {
            state.isAuthorized = true;
            state.authedUser = action.payload.user;
            setAuthToken(action.payload.token);
        },
        setMeLoading: (state: InitialState, action: PayloadAction<boolean>) => {
            state.meLoading = action.payload;
        },
        setLoginLoading: (state: InitialState, action: PayloadAction<boolean>) => {
            state.loginLoading = action.payload;
        },
        setRegisterLoading: (state: InitialState, action: PayloadAction<boolean>) => {
            state.registerLoading = action.payload;
        },
        logout: (state: InitialState) => {
            state.isAuthorized = false;
            state.authedUser = null;
            removeAuthToken();
        },
    },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
