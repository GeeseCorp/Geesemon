import {  Message } from "./types";
import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

type InitialState = {
  allMessages: Message[];
};

const initialState: InitialState = {
  allMessages: [],
};

const messageReceivedReducer = (
  state: InitialState,
  { payload }: PayloadAction<Message>
) => {
  state.allMessages.push(payload);
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveMessage: messageReceivedReducer,
  },
});

export default chatSlice.reducer;
export const { receiveMessage } = chatSlice.actions;
