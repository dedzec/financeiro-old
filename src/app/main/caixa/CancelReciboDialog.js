import React, { useCallback, useEffect } from 'react';
// import axios from 'axios';
import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// import _ from '@lodash';
import * as yup from 'yup';

import apiUrl from 'api';

import {
  // selectCaixa,
  cancelRecibo,
  closeCancelReciboDialog,
} from './store/caixaSlice';

const defaultValues = {
  idRecebimento: 0,
  nome: '',
  ra: '',
  valorFormat: 0,
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  ano: yup.string().required('You must enter a ano'),
});

// const dateFormat = (dtInsert) => {
//   let dt = dtInsert ? new Date(dtInsert) : new Date();
//   return `${correctDate(dt.getDate())}/${correctDate(
//     dt.getMonth() + 1
//   )}/${dt.getFullYear()}`;
// };
// const correctDate = (date) => {
//   return date < 10 ? `0${date}` : date;
// };

const CancelReciboDialog = () => {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  // const data = useSelector(selectCaixa);
  const caixaDialog = useSelector(({ caixaApp }) => caixaApp.caixa.caixaDialog);

  // eslint-disable-next-line no-unused-vars
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  // eslint-disable-next-line no-unused-vars
  const { isValid, dirtyFields, errors } = formState;

  // const id = watch('id');
  // const name = watch('name');
  // const avatar = watch('avatar');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (caixaDialog.type === 'edit' && caixaDialog.data) {
      reset({ ...caixaDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (caixaDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...caixaDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [caixaDialog.data, caixaDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (caixaDialog.props.open) {
      initDialog();
    }
  }, [caixaDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return dispatch(closeCancelReciboDialog());
  }

  /**
   * Form Submit
   */
  const onSubmit = () => {
    const data = getValues();
    dispatch(cancelRecibo({ data: data, user: user }));
    closeComposeDialog();
  };

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...caixaDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="sm"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {caixaDialog.type === 'new'
              ? 'Restaurar Recibo'
              : 'Cancelar Recibo'}
          </Typography>
        </Toolbar>
        {/* <div className="flex flex-col items-center justify-center pb-24">
          <Avatar className="w-96 h-96" alt="contact avatar" src={avatar} />
          {recebimentoDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {name}
            </Typography>
          )}
        </div> */}
      </AppBar>
      <form
        name="caixaForm"
        noValidate
        // onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="pt-5">Deseja cancelar o recibo desse aluno?</div>
          </div>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Avatar
                className="mx-8"
                // alt={caixaDialog.data.name}
                src={`${apiUrl}/uploads/aluno/${getValues('ra')}.jpeg`}
              />
            </div>
            <div className="pt-40">
              Aluno(a) {getValues('nome')} - no valor de{' '}
              {getValues('valorFormat')}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="justify-between p-4 pb-16">
          <div className="px-16">
            <Button variant="contained" onClick={() => closeComposeDialog()}>
              Cancelar
            </Button>
          </div>
          <div className="px-16">
            <Button
              variant="contained"
              color="secondary"
              onClick={onSubmit}
              // disabled={_.isEmpty(dirtyFields)}
            >
              Salvar
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CancelReciboDialog;
