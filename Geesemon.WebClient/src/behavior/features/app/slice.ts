import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export enum LeftSidebarState{
    Chats,
    CreateGroupChat,
    CreatePersonalChat,
}

export type InitialState = {
    initialised: boolean
    isRightSidebarVisible: boolean
    leftSidebarState: LeftSidebarState
}

const initialState: InitialState = {
    initialised: false,
    isRightSidebarVisible: false,
    leftSidebarState: LeftSidebarState.Chats,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setInitialised: (state, action: PayloadAction<boolean>) => {
            state.initialised = action.payload
        },
        setIsRightSidebarVisible: (state, action: PayloadAction<boolean>) => {
            state.isRightSidebarVisible = action.payload
        },
        setLeftSidebarState: (state, action: PayloadAction<LeftSidebarState>) => {
            state.leftSidebarState = action.payload
        },
    },
})

export const appActions = appSlice.actions
export const appReducer = appSlice.reducer