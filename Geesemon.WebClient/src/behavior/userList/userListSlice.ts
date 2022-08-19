import { UserBase, GetAllQueryResponseType } from "./types";
import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { getAllUsers } from "./thunk";

type UserListState = UserBase[] | null;

type InitialState = {
  userList: UserListState;
  isLoading: boolean;
};

const initialState: InitialState = {
  userList: null,
  isLoading: false,
};

const receiveAllUsersReducer = (
  state: InitialState,
  { payload }: PayloadAction<GetAllQueryResponseType>
) => {
  state.userList = payload.user.getAll;
};

const setIsLoadingReducer = (
  state: InitialState,
  action: PayloadAction<boolean>
) => {
  state.isLoading = action.payload;
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

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    receiveAllUsers: receiveAllUsersReducer,
    setIsLoading: setIsLoadingReducer,
  },
  extraReducers: (builder) => {
    addCasesFor(getAllUsers, builder);
  },
});

export default userListSlice.reducer;
export const { receiveAllUsers } = userListSlice.actions;
