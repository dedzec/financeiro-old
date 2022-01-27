import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import apiUrl from 'api';

export const getTurmas = createAsyncThunk(
  'caixaApp/turmas/getTurmas',
  async (user) => {
    const year = new Date().getFullYear();
    const res = await axios.get(`${apiUrl}/turmas-ano/${year}`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.data;

    return data;
  }
);

const turmasSlice = createSlice({
  name: 'caixaApp/turmas',
  initialState: [],
  reducers: {},
  extraReducers: {
    [getTurmas.fulfilled]: (state, action) => action.payload,
  },
});

export default turmasSlice.reducer;
