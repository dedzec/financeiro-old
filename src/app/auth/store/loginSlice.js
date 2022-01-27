import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import ade90Service from 'app/services/ade90Service';
import { setUserData } from './userSlice';

export const submitLogin =
  ({ login, password }) =>
  async (dispatch) => {
    return ade90Service
      .signInWithLoginAndPassword(login, password)
      .then((user) => {
        dispatch(setUserData(user));

        return dispatch(loginSuccess());
      })
      .catch((errors) => {
        return dispatch(loginError(errors));
      });
  };

export const submitLoginWithJwt =
  ({ email, password }) =>
  async (dispatch) => {
    return jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(setUserData(user));

        return dispatch(loginSuccess());
      })
      .catch((errors) => {
        return dispatch(loginError(errors));
      });
  };

export const submitLoginWithFireBase =
  ({ email, password }) =>
  async (dispatch) => {
    if (!firebaseService.auth) {
      console.warn(
        "Firebase Service didn't initialize, check your configuration"
      );

      return () => false;
    }
    return firebaseService.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        return dispatch(loginSuccess());
      })
      .catch((error) => {
        const emailErrorCodes = [
          'auth/email-already-in-use',
          'auth/invalid-email',
          'auth/operation-not-allowed',
          'auth/user-not-found',
          'auth/user-disabled',
        ];
        const passwordErrorCodes = [
          'auth/weak-password',
          'auth/wrong-password',
        ];
        const response = [];

        if (emailErrorCodes.includes(error.code)) {
          response.push({
            type: 'email',
            message: error.message,
          });
        }

        if (passwordErrorCodes.includes(error.code)) {
          response.push({
            type: 'password',
            message: error.message,
          });
        }

        if (error.code === 'auth/invalid-api-key') {
          dispatch(showMessage({ message: error.message }));
        }

        return dispatch(loginError(response));
      });
  };

const initialState = {
  success: false,
  errors: [],
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
