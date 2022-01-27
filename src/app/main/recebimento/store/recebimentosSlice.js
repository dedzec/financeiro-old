/* eslint-disable no-unused-vars */
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserData } from './userSlice';

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

export const getRecebimentos = createAsyncThunk(
  'recebimentosApp/recebimentos/getRecebimentos',
  async (user, { getState }) => {
    // routeParams =
    //   routeParams || getState().recebimentosApp.recebimentos.routeParams;

    const res = await axios.get(`${apiUrl}/recebimento`, {
      headers: {
        Authorization: 'Bearer ' + user.token,
        'Content-Type': 'application/json',
      },
    });
    const data = [];
    res.data.reverse().forEach((el) => {
      if (
        el.idUsuario == user.idUsuario &&
        dateFormat(el.createdAt) == dateFormat() &&
        el.cancelado == 0
      ) {
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
    });

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

export const addRecebimento = createAsyncThunk(
  'recebimentosApp/recebimentos/addRecebimento',
  // async (recebimento, user, { dispatch }) => {
  async (recebimento, { dispatch }) => {
    function createNotification(obj) {
      dispatch(addNotification(NotificationModel(obj)));
    }
    try {
      console.log('recebimento', recebimento);
      const res = await axios.post(`${apiUrl}/recebimento`, recebimento.data, {
        headers: {
          Authorization: 'Bearer ' + recebimento.user.token,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.data;
      dispatch(getRecebimentos(recebimento.user));

      createNotification({
        message: 'Cadastro Efetuado!',
        options: { variant: 'success' },
      });

      dispatch(closeNewRecebimentoDialog());

      return data;
    } catch (err) {
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
    }
  }
);

export const updateRecebimento = createAsyncThunk(
  'recebimentosApp/recebimentos/updateRecebimento',
  async (recebimento, { dispatch, getState }) => {
    const response = await axios.post('/api/contacts-app/update-contact', {
      recebimento,
    });
    const data = await response.data;

    dispatch(getRecebimentos());

    return data;
  }
);

export const removeRecebimento = createAsyncThunk(
  'recebimentosApp/recebimentos/removeRecebimento',
  async (idRecebimento, { dispatch, getState }) => {
    await axios.post('/api/contacts-app/remove-contact', { idRecebimento });

    return idRecebimento;
  }
);

export const removeRecebimentos = createAsyncThunk(
  'recebimentosApp/recebimentos/removeRecebimentos',
  async (idRecebimento, { dispatch, getState }) => {
    await axios.post('/api/contacts-app/remove-contacts', { idRecebimento });

    return idRecebimento;
  }
);

export const toggleStarredRecebimento = createAsyncThunk(
  'contactsApp/recebimentos/toggleStarredRecebimento',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/toggle-starred-contact',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getRecebimentos());

    return data;
  }
);

export const toggleStarredRecebimentos = createAsyncThunk(
  'recebimentosApp/recebimentos/toggleStarredRecebimentos',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/toggle-starred-contacts',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getRecebimentos());

    return data;
  }
);

export const setRecebimentosStarred = createAsyncThunk(
  'recebimentosApp/recebimentos/setRecebimentosStarred',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/set-contacts-starred',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getRecebimentos());

    return data;
  }
);

export const setRecebimentosUnstarred = createAsyncThunk(
  'ecebimentosApp/recebimentos/setRecebimentosUnstarred',
  async (idRecebimento, { dispatch, getState }) => {
    const response = await axios.post(
      '/api/contacts-app/set-contacts-unstarred',
      { idRecebimento }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getRecebimentos());

    return data;
  }
);

const recebimentosAdapter = createEntityAdapter({});

export const {
  selectAll: selectRecebimentos,
  selectById: selectRecebimentosById,
} = recebimentosAdapter.getSelectors(
  (state) => state.recebimentosApp.recebimentos
);

const recebimentosSlice = createSlice({
  name: 'recebimentosApp/recebimentos',
  initialState: recebimentosAdapter.getInitialState({
    searchText: '',
    // routeParams: {},
    recebimentoDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setRecebimentosSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewRecebimentoDialog: (state, action) => {
      state.recebimentoDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewRecebimentoDialog: (state, action) => {
      state.recebimentoDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditRecebimentoDialog: (state, action) => {
      state.recebimentoDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditRecebimentoDialog: (state, action) => {
      state.recebimentoDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [updateRecebimento.fulfilled]: recebimentosAdapter.upsertOne,
    [addRecebimento.fulfilled]: recebimentosAdapter.addOne,
    [removeRecebimentos.fulfilled]: (state, action) =>
      recebimentosAdapter.removeMany(state, action.payload),
    [removeRecebimento.fulfilled]: (state, action) =>
      recebimentosAdapter.removeOne(state, action.payload),
    [getRecebimentos.fulfilled]: (state, action) => {
      const { data } = action.payload;
      recebimentosAdapter.setAll(state, data);
      // state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setRecebimentosSearchText,
  openNewRecebimentoDialog,
  closeNewRecebimentoDialog,
  openEditRecebimentoDialog,
  closeEditRecebimentoDialog,
} = recebimentosSlice.actions;

export default recebimentosSlice.reducer;
