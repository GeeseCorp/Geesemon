import { ApolloError, FetchResult } from "@apollo/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../client";
import { showNotification } from "../notifications/notificationsSlice";
import { GetAllUsersQuery } from "./query";
import { GetAllQueryResponseType } from "./types";
import {usersActions} from "./slice";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      var response: FetchResult<GetAllQueryResponseType> = await client.query({
        query: GetAllUsersQuery,
      });
      if (response.data) {
        dispatch(usersActions.receiveAllUsers(response.data));
        return response.data.user.getAll;
      }
    } catch (err) {
      let error = err as ApolloError;
      dispatch(showNotification(error.message));
      return rejectWithValue(error.message);
    }
  }
);
