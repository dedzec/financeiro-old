import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import apiUrl from 'api';

export const getTipos = createAsyncThunk(
  'recebimentosApp/tipos/getTipos',
  async (user) => {
    const res = await axios.get(`${apiUrl}/recebimento-tipo`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });

    const data = [];
    res.data.forEach((el) => {
      if (el.cancelado == 0) data.push(el);
    });

    return data;
  }
);

const tiposSlice = createSlice({
  name: 'recebimentosApp/tipos',
  initialState: [],
  reducers: {},
  extraReducers: {
    [getTipos.fulfilled]: (state, action) => action.payload,
  },
});

export default tiposSlice.reducer;
