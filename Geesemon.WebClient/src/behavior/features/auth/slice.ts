import {AuthResponseType, User} from "./types";
import {ActionReducerMapBuilder, AsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {login, me, register} from "./thunks";

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

const authorizeReducer = (
    state: InitialState,
    {payload}: PayloadAction<AuthResponseType>
) => {
  state.authedUser = payload.user;
  localStorage.setItem("token", payload.token);
  state.isAuthorized = true;
};

const setIsLoadingReducer = (
    state: InitialState,
    action: PayloadAction<boolean>
) => {
  state.isLoading = action.payload;
};

const logoutReducer = (state: InitialState) => {
  state.isAuthorized = false;
  state.authedUser = null;
  localStorage.removeItem("token");
};

const addCasesFor = (
    thunk: AsyncThunk<any, any, {}>,
    builder: ActionReducerMapBuilder<InitialState>
) => {
  builder
      .addCase(thunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(thunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(thunk.rejected, (state) => {
        state.isLoading = false;
      });
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    authorize: authorizeReducer,
    setIsLoading: setIsLoadingReducer,
    logout: logoutReducer,
  },
  extraReducers: (builder) => {
    addCasesFor(me, builder);
    addCasesFor(login, builder);
    addCasesFor(register, builder);
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
