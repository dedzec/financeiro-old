/* eslint-disable no-unused-vars */
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';

import apiUrl from 'api';

// import reducer from 'app/fuse-layouts/shared-components/notificationPanel/store';
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

export const getCaixa = createAsyncThunk(
  'caixaApp/caixa/getCaixa',
  async (user, { getState }) => {
    // routeParams =
    //   routeParams || getState().caixaApp.recebimentos.routeParams;

    const res = await axios.get(`${apiUrl}/recebimento`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });
    const data = [];
    if (user.role == 'admin') {
      res.data.reverse().forEach((el) => {
        if (new Date(el.createdAt).getFullYear() == new Date().getFullYear()) {
          if (el.cancelado == 0) {
            let tipo = '';
            el.tipos.forEach((e, index) => {
              if (index == 0) tipo = `${e.tipo}`;
              else tipo = `${tipo}, ${e.tipo}`;
            });
            data.push({
              ...el,
              data: dateFormat(el.createdAt),
              id: el.idRecebimento,
              valorFormat: currencyFormatter(el.valor),
              tipo: tipo,
            });
          }
        }
      });
    } else {
      res.data.reverse().forEach((el) => {
        if (new Date(el.createdAt).getFullYear() == new Date().getFullYear()) {
          if (el.idUsuario == user.idUsuario && el.cancelado == 0) {
            let tipo = '';
            el.tipos.forEach((e, index) => {
              if (index == 0) tipo = `${e.tipo}`;
              else tipo = `${tipo}, ${e.tipo}`;
            });
            data.push({
              ...el,
              data: dateFormat(el.createdAt),
              id: el.idRecebimento,
              valorFormat: currencyFormatter(el.valor),
              tipo: tipo,
            });
          }
        }
      });
    }

    // const res = await axios.get(`${apiUrl}/recebimento`, {
    //   headers: {
    //     Authorization: 'Bearer ' + user.token,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // const data = await res.data.filter(
    //   (rec) =>
    //     rec.idUsuario == user.idUsuario && dateFormat(rec.createdAt) == dateFormat()
    // );

    return { data };
  }
);

export const removeCaixa = createAsyncThunk(
  'caixaApp/caixa/removeCaixa',
  async (idRecebimento, { dispatch, getState }) => {
    await axios.post('/api/contacts-app/remove-contact', { idRecebimento });

    return idRecebimento;
  }
);

export const cancelRecibo = createAsyncThunk(
  'caixaApp/caixa/cancelRecibo',
  async (recebimento, { dispatch, getState }) => {
    function createNotification(obj) {
      dispatch(addNotification(NotificationModel(obj)));
    }
    try {
      const res = await axios.post(
        `${apiUrl}/recebimento-cancel/${recebimento.data.idRecebimento}`,
        recebimento.data,
        {
          headers: {
            Authorization: 'Bearer ' + recebimento.user.token,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await res.data;

      createNotification({
        message: 'Recebimento Cancelado!',
        options: { variant: 'success' },
      });

      dispatch(getCaixa(recebimento.user));

      return data;
    } catch (err) {
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
    }
  }
);

export const toggleStarredCaixa = createAsyncThunk(
  'caixaApp/caixa/toggleStarredCaixa',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/toggle-starred-contact',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getCaixa());

    return data;
  }
);

export const setCaixaStarred = createAsyncThunk(
  'caixaApp/caixa/setCaixatarred',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/set-contacts-starred',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getCaixa());

    return data;
  }
);

export const setCaixaUnstarred = createAsyncThunk(
  'caixaApp/caixa/setCaixasUnstarred',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/set-contacts-unstarred',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getCaixa());

    return data;
  }
);

const caixaAdapter = createEntityAdapter({});

export const { selectAll: selectCaixa, selectById: selectCaixaById } =
  caixaAdapter.getSelectors((state) => state.caixaApp.caixa);

const caixaSlice = createSlice({
  name: 'caixaApp/caixa',
  initialState: caixaAdapter.getInitialState({
    searchText: '',
    // routeParams: {},
    caixaDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
    listDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setCaixaSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openRelatorioDialog: (state, action) => {
      state.relatorioDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeRelatorioDialog: (state, action) => {
      state.relatorioDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openListDialog: (state, action) => {
      state.listDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeListDialog: (state, action) => {
      state.listDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    // openEditCaixaDialog: (state, action) => {
    //   state.caixaDialog = {
    //     type: 'edit',
    //     props: {
    //       open: true,
    //     },
    //     data: action.payload,
    //   };
    // },
    // closeEditCaixaDialog: (state, action) => {
    //   state.caixaDialog = {
    //     type: 'edit',
    //     props: {
    //       open: false,
    //     },
    //     data: null,
    //   };
    // },
    openCancelReciboDialog: (state, action) => {
      state.caixaDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeCancelReciboDialog: (state, action) => {
      state.caixaDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    // [updateCaixa.fulfilled]: caixaAdapter.upsertOne,
    // [addCaixa.fulfilled]: caixaAdapter.addOne,
    [cancelRecibo.fulfilled]: (state, action) =>
      caixaAdapter.removeOne(state, action.payload),
    [removeCaixa.fulfilled]: (state, action) =>
      caixaAdapter.removeOne(state, action.payload),
    [getCaixa.fulfilled]: (state, action) => {
      const { data } = action.payload;
      caixaAdapter.setAll(state, data);
      // state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setCaixaSearchText,
  openRelatorioDialog,
  closeRelatorioDialog,
  openListDialog,
  closeListDialog,
  // openEditCaixaDialog,
  // closeEditCaixaDialog,
  openCancelReciboDialog,
  closeCancelReciboDialog,
} = caixaSlice.actions;

export default caixaSlice.reducer;
