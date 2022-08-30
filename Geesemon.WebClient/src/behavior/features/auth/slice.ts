import {AuthResponseType, User} from "./types";
import {ActionReducerMapBuilder, AsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {LoginInputType, RegisterInputType} from "./mutations";

type InitialState = {
    authedUser?: User | null;
    isAuthorized: boolean;
    isLoading: boolean;
};

const initialState: InitialState = {
    isAuthorized: false,
    authedUser: null,
    isLoading: false,
};

const slice = createSlice({
    name: "users",
    initialState,
    reducers: {
        meAsync: (state: InitialState, action: PayloadAction) => state,
        loginAsync: (state: InitialState, action: PayloadAction<LoginInputType>) => state,
        registerAsync: (state: InitialState, action: PayloadAction<RegisterInputType>) => state,
        authorize: (state: InitialState, action: PayloadAction<AuthResponseType>) => {
            state.authedUser = action.payload.user;
            localStorage.setItem("token", action.payload.token);
            state.isAuthorized = true;
        },
        setIsLoading: (state: InitialState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        logout: (state: InitialState) => {
            state.isAuthorized = false;
            state.authedUser = null;
            localStorage.removeItem("token");
        },
    },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
