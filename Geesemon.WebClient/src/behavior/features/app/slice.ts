import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum LeftSidebarState {
    Chats = 0,
    CreateGroupChat = 1,
    CreatePersonalChat = 2,
    Settings = 3,
}

export enum SettingsCategory {
    UpdateProfile = 0,
    Devices = 1,
    Languages = 2,
}

export enum RightSidebarState {
    Profile = 'Profile',
    UpdateGroup = 'UpdateGroup',
    GroupAddMembers = 'GroupAddMembers',
}

export type InitialState = {
    initialised: boolean;

    leftSidebarState: LeftSidebarState;
    settingsCategory?: SettingsCategory | null;

    isRightSidebarVisible: boolean;
    rightSidebarState: RightSidebarState;

    readQrCode: boolean;
};

const initialState: InitialState = {
  initialised: false,

  leftSidebarState: LeftSidebarState.Chats,
  settingsCategory: null,

  isRightSidebarVisible: false,
  rightSidebarState: RightSidebarState.Profile,

  readQrCode: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialised: (state, action: PayloadAction<boolean>) => {
      state.initialised = action.payload;
    },

    setLeftSidebarState: (state, action: PayloadAction<LeftSidebarState>) => {
      state.leftSidebarState = action.payload;
    },
    setSettingsCategory: (state, action: PayloadAction<SettingsCategory | null | undefined>) => {
      state.settingsCategory = action.payload;
    },

    setIsRightSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.isRightSidebarVisible = action.payload;
    },
    setRightSidebarState: (state, action: PayloadAction<RightSidebarState>) => {
      state.rightSidebarState = action.payload;
    },

    setReadQrCode: (state, action: PayloadAction<boolean>) => {
      state.readQrCode = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;