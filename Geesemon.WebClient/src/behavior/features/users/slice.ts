import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserGetInputType, UsersGetReadByVars } from "./queries";
import { User } from "./types";

type InitialState = {
    users: User[]
    usersGetLoading: boolean
    hasNext: boolean
    take: number
    skip: number
    q: string

    readByGetLoading: boolean
    readByHasNext: boolean
    readByTake: number
};

const initialState: InitialState = {
    users: [],
    usersGetLoading: false,
    hasNext: true,
    take: 20,
    skip: 0,
    q: '',

    readByGetLoading: false,
    readByHasNext: true,
    readByTake: 20,
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

        readByGetAsync: (state, action: PayloadAction<UsersGetReadByVars>) => state,
        setReadByGetLoading: (state, action: PayloadAction<boolean>) => {
            state.readByGetLoading = action.payload;
        },
        setReadByHasNext: (state, action: PayloadAction<boolean>) => {
            state.readByHasNext = action.payload;
        },
        setReadByTake: (state, action: PayloadAction<number>) => {
            state.readByTake = action.payload;
        },

        resetUsers: (state, action: PayloadAction) => {
            state.users = initialState.users;
            state.usersGetLoading = initialState.usersGetLoading;
            state.hasNext = initialState.hasNext;
            state.take = initialState.take;
            state.skip = initialState.skip;
            state.q = initialState.q;
        },
        resetReadBy: (state, action: PayloadAction) => {
            state.readByGetLoading = initialState.readByGetLoading;
            state.readByHasNext = initialState.readByHasNext;
            state.readByTake = initialState.readByTake;
        },
        toInitialState: (state, action: PayloadAction) => initialState,
    },
});

export const usersReducer = slice.reducer;
export const usersActions = slice.actions;
