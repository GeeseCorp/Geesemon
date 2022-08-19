import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";

type InitialState = {
  notification: string;
};

const initialState: InitialState = {
  notification: "",
};

const openNotification = () => {
  notification.open({
    message: "Notification Title",
    description:
      "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};

const showNotificationsReducer = (
  state: InitialState,
  { payload }: PayloadAction<string>
) => {
  state.notification = payload;
  openNotification();
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    showNotification: showNotificationsReducer,
  },
});

export default notificationsSlice.reducer;
export const { showNotification } = notificationsSlice.actions;
