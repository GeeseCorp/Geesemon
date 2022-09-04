import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {To} from "react-router-dom";

type InitialState = {
    to: To | number | null,
}

const initialState: InitialState = {
    to: null,
}

export const navigateSlice = createSlice({
    name: 'navigate',
    initialState,
    reducers: {
        navigate: (state, action: PayloadAction<To | number>) => {
            state.to = action.payload;
        },
        removeNavigate: (state, action: PayloadAction) => {
            state.to = null
        },
    },
})

export const navigateActions = navigateSlice.actions
export const navigateReducer = navigateSlice.reducer