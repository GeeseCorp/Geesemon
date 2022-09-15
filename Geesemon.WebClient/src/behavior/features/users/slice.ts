import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserGetInputType } from "./queries";
import { User } from "./types";

type InitialState = {
    users: User[]
    usersGetLoading: boolean
};

const initialState: InitialState = {
    users: [],
    usersGetLoading: false,
};


const slice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUsers: (state, action: PayloadAction<User[]>) => {
            state.users = [...state.users, ...action.payload];
        },
        usersGetAsync: (state, action: PayloadAction<UserGetInputType>) => state,
        setUsersGetLoading: (state, action: PayloadAction<boolean>) => {
            state.usersGetLoading = action.payload;
        },

        toInitialState: (state, action: PayloadAction) => {
            state = initialState;
        },
    },
});

export const usersReducer = slice.reducer;
export const usersActions = slice.actions;
