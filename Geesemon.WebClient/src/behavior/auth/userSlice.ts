import { User, AuthResponseType } from "./types";
import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { login, me, register } from "./thunk";

type UserState = User | null;

type InitialState = {
  user: UserState;
  isAuthorized: boolean;
  isLoading: boolean;
};

const initialState: InitialState = {
  isAuthorized: false,
  user: null,
  isLoading: false,
};

const authorizeReducer = (
  state: InitialState,
  { payload }: PayloadAction<AuthResponseType>
) => {
  state.user = payload.user;
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
  state.user = null;
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

const userSlice = createSlice({
  name: "user",
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

export default userSlice.reducer;
export const { authorize, logout } = userSlice.actions;
