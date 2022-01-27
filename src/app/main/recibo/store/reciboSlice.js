/* eslint-disable no-unused-vars */
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';

import apiUrl from 'api';

import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';

const dateFormat = (dt) => {
  let date = dt ? new Date(dt) : new Date();
  return `${correctDate(date.getDate())}/${correctDate(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};
const correctDate = (date) => {
  return date < 10 ? `0${date}` : date;
};
const currencyFormatter = (formatted_value) => {
  // Set to 0,00 when "" and divide by 100 to start by the cents when start typing
  if (!Number(formatted_value)) return 'R$ 0,00';
  const br = { style: 'currency', currency: 'BRL' };
  return new Intl.NumberFormat('pt-BR', br).format(formatted_value);
};

export const getRecibos = createAsyncThunk(
  'reciboApp/recibo/getRecibos',
  async (user) => {
    const res = await axios.get(`${apiUrl}/recebimento-tipo`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });
    console.log('recibos', res.data);

    const data = [];
    res.data.reverse().forEach((el) => {
      if (el.cancelado == 0) {
        data.push({
          ...el,
          data: dateFormat(el.createdAt),
          id: el.idRecebimentoTipo,
          valorFormat: currencyFormatter(el.valor),
        });
      }
    });

    return { data };
  }
);

export const addRecibo = createAsyncThunk(
  'reciboApp/recibo/addRecibo',
  // async (recibo, user, { dispatch }) => {
  async (recibo, { dispatch }) => {
    function createNotification(obj) {
      dispatch(addNotification(NotificationModel(obj)));
    }
    try {
      const res = await axios.post(`${apiUrl}/recebimento-tipo`, recibo.data, {
        headers: {
          Authorization: 'Bearer ' + recibo.user.token,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.data;
      dispatch(getRecibos(recibo.user));

      createNotification({
        message: 'Recibo Criado!',
        options: { variant: 'success' },
      });

      dispatch(closeNewReciboDialog());

      return data;
    } catch (err) {
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
    }
  }
);

export const updateRecibo = createAsyncThunk(
  'reciboApp/recibo/updateRecibo',
  async (recibo, { dispatch }) => {
    function createNotification(obj) {
      dispatch(addNotification(NotificationModel(obj)));
    }
    try {
      const res = await axios.post(
        `${apiUrl}/recebimento-tipo/${recibo.data.idRecebimentoTipo}`,
        recibo.data,
        {
          headers: {
            Authorization: 'Bearer ' + recibo.user.token,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.data;

      createNotification({
        message: 'Recibo Atualizado!',
        options: { variant: 'success' },
      });

      dispatch(getRecibos(recibo.user));

      return data;
    } catch (err) {
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
    }
  }
);

const reciboAdapter = createEntityAdapter({});

export const { selectAll: selectRecibo, selectById: selectReciboById } =
  reciboAdapter.getSelectors((state) => state.reciboApp.recibo);

const reciboSlice = createSlice({
  name: 'reciboApp/recibo',
  initialState: reciboAdapter.getInitialState({
    searchText: '',
    // routeParams: {},
    reciboDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setReciboSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewReciboDialog: (state, action) => {
      state.reciboDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewReciboDialog: (state, action) => {
      state.reciboDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditReciboDialog: (state, action) => {
      state.reciboDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditReciboDialog: (state, action) => {
      state.reciboDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    // [getRecibos.fulfilled]: (state, action) => action.payload,
    [updateRecibo.fulfilled]: reciboAdapter.upsertOne,
    [addRecibo.fulfilled]: reciboAdapter.addOne,
    [getRecibos.fulfilled]: (state, action) => {
      const { data } = action.payload;
      reciboAdapter.setAll(state, data);
      // state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setReciboSearchText,
  openNewReciboDialog,
  closeNewReciboDialog,
  openEditReciboDialog,
  closeEditReciboDialog,
} = reciboSlice.actions;

export default reciboSlice.reducer;
