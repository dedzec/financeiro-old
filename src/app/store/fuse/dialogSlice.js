import { createSlice } from '@reduxjs/toolkit';

const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    state: false,
    options: {
      children: 'Hi',
    },
  },
  reducers: {
    openDialog: (state, action) => {
      state.state = true;
      state.options = action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    closeDialog: (state, action) => {
      state.state = false;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
