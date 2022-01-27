import { combineReducers } from '@reduxjs/toolkit';
import recebimentos from './recebimentosSlice';
import alunos from './alunosSlice';
import tipos from './tiposSlice';
// import user from './userSlice';

const reducer = combineReducers({
  recebimentos,
  alunos,
  tipos,
  // user,
});

export default reducer;
