import {ApolloError, FetchResult,} from "@apollo/client";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {client} from "../../client";
import {loginQuery, meQuery, registerQuery} from "./queries";
import {LoginQueryResponse, LoginRequest, MeQueryResponse, RegisterQueryResponse, RegisterRequest,} from "./types";
import {authActions} from "./slice";
import {notificationsActions} from "../notifications/slice";

export const me = createAsyncThunk(
    "user/me",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            var response: FetchResult<MeQueryResponse> = await client.query({
                query: meQuery,
            });
            if (response.data) {
                dispatch(authActions.authorize(response.data.auth.me));
                return response.data.auth.me;
            }
        } catch (err) {
            let error = err as ApolloError;
            dispatch(notificationsActions.addError(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const login = createAsyncThunk(
    "user/login",
    async (params: LoginRequest, {rejectWithValue, dispatch}) => {
        try {
            var response: FetchResult<LoginQueryResponse> = await client.mutate({
                mutation: loginQuery,
                variables: {input: params},
            });
            if (response.data) {
                dispatch(authActions.authorize(response.data.auth.login));

                return response.data.auth.login;
            }
        } catch (err) {
            let error = err as ApolloError;
            dispatch(notificationsActions.addError(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const register = createAsyncThunk(
    "user/register",
    async (params: RegisterRequest, {rejectWithValue, dispatch}) => {
        try {
            var response: FetchResult<RegisterQueryResponse> = await client.mutate({
                mutation: registerQuery,
                variables: {input: params},
            });
            if (response.data) {
                dispatch(authActions.authorize(response.data.auth.register));

                return response.data.auth.register;
            }
        } catch (err) {
            let error = err as ApolloError;
            dispatch(notificationsActions.addError(error.message));
            return rejectWithValue(error.message);
        }
    }
);
