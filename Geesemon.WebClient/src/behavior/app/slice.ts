import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type InitialState = {
    initialised: boolean
}

const initialState: InitialState = {
    initialised: false,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setInitialised: (state, action: PayloadAction<boolean>) => {
            state.initialised = action.payload
        },
    },
})

export const appActions = appSlice.actions
export const appReducer = appSlice.reducer