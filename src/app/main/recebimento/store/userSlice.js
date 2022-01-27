import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import apiUrl from 'api';

const dateFormat = (dtInsert) => {
  let dt = dtInsert ? new Date(dtInsert) : new Date();
  return `${correctDate(dt.getDate())}/${correctDate(
    dt.getMonth() + 1
  )}/${dt.getFullYear()}`;
};
const correctDate = (date) => {
  return date < 10 ? `0${date}` : date;
};

export const getUserData = createAsyncThunk(
  'recebimentosApp/user/getUserData',
  async (user) => {
    const res = await axios.get(`${apiUrl}/recebimento`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.data.filter(
      (rec) =>
        rec.idUsuario == user.idUsuario &&
        dateFormat(rec.dtInsert) == dateFormat()
    );
    return data;
  }
);

const userSlice = createSlice({
  name: 'recebimentosApp/user',
  initialState: {},
  reducers: {},
  extraReducers: {
    [getUserData.fulfilled]: (state, action) => action.payload,
  },
});

export default userSlice.reducer;
