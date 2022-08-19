import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type counterPayload = {
    by : number
}

const testSlice = createSlice({
    name: "test",
    initialState: {
        counter: 0
    },
    reducers:{
        incrementBy(state, action: PayloadAction<counterPayload>) {
            state.counter = state.counter + action.payload.by
        },
        decrementBy(state, action: PayloadAction<counterPayload>) {
            state.counter = state.counter - action.payload.by
        }
    }
});

export default testSlice.reducer
export const {incrementBy, decrementBy} = testSlice.actions