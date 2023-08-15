import { AuthResponseType, LoginQrCode, Session } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUpdateProfileType, LoginInputType, RegisterInputType } from './mutations';
import { User } from '../users/types';
import { localStorageRemoveItem, localStorageSetItem } from '../../../utils/localStorageUtils';

type InitialState = {
    authedUser?: User | null;
    isAuthorized: boolean;
    meLoading: boolean;
    loginLoading: boolean;
    registerLoading: boolean;
    logoutLoading: boolean;

    currentSession?: Session | null;
    sessions: Session[];
    sessionsGetLoading: boolean;
    terminateAllOtherSessionsLoading: boolean;

    updateProfileLoading: boolean;

    loginQrCode: LoginQrCode | null;
    generateLoginQrCodeLoading: boolean;
    loginViaTokenLoading: boolean;
};

const initialState: InitialState = {
  isAuthorized: false,
  authedUser: null,
  meLoading: false,
  loginLoading: false,
  registerLoading: false,
  logoutLoading: false,

  currentSession: null,
  sessions: [],
  sessionsGetLoading: false,
  terminateAllOtherSessionsLoading: false,

  updateProfileLoading: false,

  loginQrCode: null,
  generateLoginQrCodeLoading: false,
  loginViaTokenLoading: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    meAsync: (state: InitialState) => state,
    setMeLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.meLoading = action.payload;
    },

    loginAsync: (state: InitialState, action: PayloadAction<LoginInputType>) => state,
    login: (state: InitialState, action: PayloadAction<AuthResponseType>) => {
      state.isAuthorized = true;
      state.authedUser = action.payload.user;
      localStorageSetItem('AuthToken', action.payload.token);
      state.currentSession = action.payload.session;
    },
    setLoginLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.loginLoading = action.payload;
    },

    registerAsync: (state: InitialState, action: PayloadAction<RegisterInputType>) => state,
    setRegisterLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.registerLoading = action.payload;
    },

    setLogoutLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.logoutLoading = action.payload;
    },
    logoutAsync: (state: InitialState, action: PayloadAction) => state,
    logout: (state: InitialState) => {
      state.isAuthorized = false;
      state.authedUser = null;
      state.currentSession = null;
      localStorageRemoveItem('AuthToken');
    },

    toggleOnlineAsync: (state: InitialState, action: PayloadAction<boolean>) => state,

    getSessionsAsync: (state: InitialState, action: PayloadAction) => state,
    setSessions: (state: InitialState, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    setSessionsGetLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.sessionsGetLoading = action.payload;
    },

    terminateSessionAsync: (state: InitialState, action: PayloadAction<{ sessionId: string }>) => state,
    terminateAllOtherSessionsAsync: (state: InitialState, action: PayloadAction) => state,
    setTerminateAllOtherSessionsLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.terminateAllOtherSessionsLoading = action.payload;
    },

    updateAuthedUser: (state: InitialState, action: PayloadAction<User | null | undefined>) => {
      state.authedUser = action.payload;
    },
    updateProfileAsync: (state: InitialState, action: PayloadAction<AuthUpdateProfileType>) => state,
    setUpdateProfileLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.updateProfileLoading = action.payload;
    },

    generateLoginQrCodeAsync: (state: InitialState) => state,
    setGenerateLoginQrCodeLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.generateLoginQrCodeLoading = action.payload;
    },
    setLoginQrCode: (state: InitialState, action: PayloadAction<LoginQrCode>) => {
      state.loginQrCode = action.payload;
    },

    loginViaTokenAsync: (state: InitialState, action: PayloadAction<string>) => state,
    setLoginViaTokenLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.loginViaTokenLoading = action.payload;
    },

    toInitialState: (state, action: PayloadAction) => initialState,
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
