import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserGetInputType } from "./queries";
import { User } from "./types";

type InitialState = {
    users: User[]
    usersGetLoading: boolean
    hasNext: boolean
    take: number
    skip: number
    q: string
};

const initialState: InitialState = {
    users: [],
    usersGetLoading: false,
    hasNext: true,
    take: 20,
    skip: 0,
    q: '',
};


const slice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUsers: (state, action: PayloadAction<User[]>) => {
            state.users = [...state.users, ...action.payload];
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        usersGetAsync: (state, action: PayloadAction<UserGetInputType>) => state,
        setUsersGetLoading: (state, action: PayloadAction<boolean>) => {
            state.usersGetLoading = action.payload;
        },
        setHasNext: (state, action: PayloadAction<boolean>) => {
            state.hasNext = action.payload;
        },
        setTake: (state, action: PayloadAction<number>) => {
            state.take = action.payload;
        },
        setSkip: (state, action: PayloadAction<number>) => {
            state.skip = action.payload;
        },
        setQ: (state, action: PayloadAction<string>) => {
            state.q = action.payload;
        },

        toInitialState: (state, action: PayloadAction) => {
            state = initialState;
        },
    },
});

export const usersReducer = slice.reducer;
export const usersActions = slice.actions;
