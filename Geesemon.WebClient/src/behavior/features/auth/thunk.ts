import {
  ApolloError,
  FetchResult,
} from "@apollo/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";
import { showNotification } from "../notifications/notificationsSlice";
import { loginQuery, meQuery, registerQuery } from "./query";
import {
  MeQueryResponse,
  LoginRequest,
  LoginQueryResponse,
  RegisterRequest,
  RegisterQueryResponse,
} from "./types";
import {authActions} from "./slice";

export const me = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue, dispatch }) => {
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
      dispatch(showNotification(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (params: LoginRequest, { rejectWithValue, dispatch }) => {
    try {
      var response: FetchResult<LoginQueryResponse> = await client.mutate({
        mutation: loginQuery,
        variables: { input: params },
      });
      if (response.data) {
        dispatch(authActions.authorize(response.data.auth.login));

        return response.data.auth.login;
      }
    } catch (err) {
      let error = err as ApolloError;
      dispatch(showNotification(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (params: RegisterRequest, { rejectWithValue, dispatch }) => {
    try {
      var response: FetchResult<RegisterQueryResponse> = await client.mutate({
        mutation: registerQuery,
        variables: { input: params },
      });
      if (response.data) {
        dispatch(authActions.authorize(response.data.auth.register));

        return response.data.auth.register;
      }
    } catch (err) {
      let error = err as ApolloError;
      dispatch(showNotification(error.message));
      return rejectWithValue(error.message);
    }
  }
);
