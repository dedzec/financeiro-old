import { combineReducers } from '@reduxjs/toolkit';
import caixa from './caixaSlice';
import tipos from './tiposSlice';
import turmas from './turmasSlice';

const reducer = combineReducers({
  caixa,
  tipos,
  turmas,
});

export default reducer;
