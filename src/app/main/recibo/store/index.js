import { combineReducers } from '@reduxjs/toolkit';
import recibo from './reciboSlice';

const reducer = combineReducers({
  recibo,
});

export default reducer;
