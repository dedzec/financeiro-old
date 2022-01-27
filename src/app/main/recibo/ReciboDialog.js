import React, { useCallback, useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils/FuseUtils';
import NumberFormat from 'react-number-format';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import {
  addRecibo,
  updateRecibo,
  closeNewReciboDialog,
} from './store/reciboSlice';

const NumberFormatCustom = (props) => {
  const { onValueChange } = props;
  const [value, setValue] = useState(0);

  const handleChange = (v) => {
    // Set the value to value * 100 because it was divided on the field value prop
    setValue(parseFloat(v.value) * 100);
    if (onValueChange) {
      onValueChange({ ...v, floatValue: v.floatValue / 100 });
    }
  };

  const currencyFormatter = (formatted_value) => {
    // Set to 0,00 when "" and divide by 100 to start by the cents when start typing
    if (!Number(formatted_value)) return 'R$ 0,00';
    const br = { style: 'currency', currency: 'BRL' };
    return new Intl.NumberFormat('pt-BR', br).format(formatted_value / 100);
  };

  const keyDown = (e) => {
    //This if keep the cursor position on erase if the value is === 0
    if (e.code === 'Backspace' && !value) {
      e.preventDefault();
    }
    // This if sets the value to 0 and prevent the default for the cursor to keep when there's only cents
    if (e.code === 'Backspace' && value < 1000) {
      e.preventDefault();
      setValue(0);
    }
  };

  return (
    <NumberFormat
      {...props}
      value={Number(value) / 100}
      format={currencyFormatter}
      onValueChange={handleChange}
      prefix={'R$ '}
      mask=""
      allowEmptyFormatting
      decimalSeparator=","
      thousandSeparator="."
      decimalScale={2}
      // customInput={TextFieldStyle}
      onKeyDown={keyDown}
    />
  );
};

const defaultValues = {
  idRecebimentoTipo: 0,
  tipo: '',
  valor: 0,
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

function ReciboDialog() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const reciboDialog = useSelector(
    ({ reciboApp }) => reciboApp.recibo.reciboDialog
  );

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

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (reciboDialog.type === 'edit' && reciboDialog.data) {
      reset({ ...reciboDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (reciboDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...reciboDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [reciboDialog.data, reciboDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (reciboDialog.props.open) {
      initDialog();
    }
  }, [reciboDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return dispatch(closeNewReciboDialog());
  }

  /**
   * Form Submit
   */
  const onSubmit = () => {
    let valorReal = getValues('valor')
      .replace('R$', '')
      .replace('.', '')
      .replace('.', '')
      .replace('.', '')
      .replace(',', '.');
    const data = {
      idRecebimentoTipo: getValues('idRecebimentoTipo'),
      tipo: getValues('tipo'),
      valor: valorReal.trim(),
    };

    if (reciboDialog.type === 'new') {
      dispatch(addRecibo({ data: data, user: user }));
    } else {
      dispatch(updateRecibo({ data: data, user: user }));
    }
    closeComposeDialog();
  };

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...reciboDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="md"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {reciboDialog.type === 'new' ? 'Novo Recibo' : 'Editar Recibo'}
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        name="reciboForm"
        noValidate
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">label</Icon>
            </div>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Recibo"
                  id="recibo"
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">monetization_on</Icon>
            </div>
            <Controller
              control={control}
              name="valor"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Valor"
                  id="valor"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              )}
            />
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
              disabled={_.isEmpty(dirtyFields)}
            >
              {reciboDialog.type === 'new' ? 'Add' : 'Edit'}
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ReciboDialog;
