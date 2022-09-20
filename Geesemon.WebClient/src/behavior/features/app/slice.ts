import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export enum LeftSidebarState{
    Chats,
    CreateGroupChat,
    CreatePersonalChat,
}

export enum RightSidebarState{
    Profile,
    UpdateGroup,
}

export type InitialState = {
    initialised: boolean
    isRightSidebarVisible: boolean
    leftSidebarState: LeftSidebarState
    rightSidebarState: RightSidebarState
}

const initialState: InitialState = {
    initialised: false,
    isRightSidebarVisible: false,
    leftSidebarState: LeftSidebarState.Chats,
    rightSidebarState: RightSidebarState.Profile,
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
        setRightSidebarState: (state, action: PayloadAction<RightSidebarState>) => {
            state.rightSidebarState = action.payload
        },
    },
})

export const appActions = appSlice.actions
export const appReducer = appSlice.reducer