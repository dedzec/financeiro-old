import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import apiUrl from 'api';

export const getAlunos = createAsyncThunk(
  'recebimentosApp/alunos/getAlunos',
  async (user) => {
    const res = await axios.get(`${apiUrl}/alunos-ano/${user.anoLetivo}`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });
    // console.log('Usuario', user);
    // console.log('Alunos', res.data);
    const data = await res.data;

    return data;
  }
);

const alunosSlice = createSlice({
  name: 'recebimentosApp/alunos',
  initialState: [],
  reducers: {},
  extraReducers: {
    [getAlunos.fulfilled]: (state, action) => action.payload,
  },
});

export default alunosSlice.reducer;
