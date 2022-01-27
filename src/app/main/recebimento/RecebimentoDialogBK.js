import React, { useCallback, useEffect, useState } from 'react';
// import axios from 'axios';
import FuseUtils from '@fuse/utils/FuseUtils';
import NumberFormat from 'react-number-format';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

// import apiUrl from 'api';

import {
  // addRecebimento,
  closeNewRecebimentoDialog,
} from './store/recebimentosSlice';

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

const currencyFormatter = (formatted_value) => {
  // Set to 0,00 when "" and divide by 100 to start by the cents when start typing
  if (!Number(formatted_value)) return 'R$ 0,00';
  const br = { style: 'currency', currency: 'BRL' };
  return new Intl.NumberFormat('pt-BR', br).format(formatted_value);
};

const defaultValues = {
  aluno: { idAluno: 0 },
  valor: 0,
  desc: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
});

function RecebimentoDialog() {
  const dispatch = useDispatch();
  // const user = useSelector(({ auth }) => auth.user);
  const recebimentoDialog = useSelector(
    ({ recebimentosApp }) => recebimentosApp.recebimentos.recebimentoDialog
  );
  const alunos = useSelector(({ recebimentosApp }) => recebimentosApp.alunos);
  const tipos = useSelector(({ recebimentosApp }) => recebimentosApp.tipos);
  const [count, setCount] = useState(0);
  const [valueTotal, setValueTotal] = useState(0);
  const [arrayTipos, setArrayTipos] = useState([
    {
      idTipo: `recibo${count}`,
      nameTipo: `tipo${count}`,
      idValor: `valor${count}`,
      nameValor: `valor${count}`,
      id: 0,
      tipo: '',
      valor: 0,
    },
  ]);

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
    setValueTotal(0);
    /**
     * Dialog type: 'edit'
     */
    if (recebimentoDialog.type === 'edit' && recebimentoDialog.data) {
      reset({ ...recebimentoDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (recebimentoDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...recebimentoDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [recebimentoDialog.data, recebimentoDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (recebimentoDialog.props.open) {
      initDialog();
    }
  }, [recebimentoDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return dispatch(closeNewRecebimentoDialog());
  }

  /**
   * Form Submit
   */
  const onSubmit = () => {
    console.log('arrayTipos:', arrayTipos);
    console.log('Dados:', getValues());
    // let valorReal = getValues('valor')
    //   .replace('R$', '')
    //   .replace('.', '')
    //   .replace('.', '')
    //   .replace('.', '')
    //   .replace(',', '.');

    // const data = {
    //   // valor: valorReal.trim(),
    //   valor: valueTotal,
    //   desc: getValues('desc'),
    //   idAluno: getValues('aluno').idAluno,
    //   tipos: getValues('tipo'),
    // };

    // dispatch(addRecebimento({ data: data, user: user }));
    // closeComposeDialog();
  };

  const totalValue = () => {
    let total = 0;
    arrayTipos.forEach((el) => {
      total += parseFloat(el.valor);
    });
    setValueTotal(total);
  };

  const addTipo = () => {
    setCount(count + 1);
    setArrayTipos([
      ...arrayTipos,
      {
        idTipo: `recibo${count}`,
        nameTipo: `tipo${count}`,
        idValor: `valor${count}`,
        nameValor: `valor${count}`,
        id: 0,
        tipo: '',
        valor: 0,
      },
    ]);
  };

  const rmTipo = (arTipo) => {
    if (arrayTipos.length > 1) {
      console.log(arTipo);
    }
  };

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...recebimentoDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="md"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {recebimentoDialog.type === 'new'
              ? 'Novo Recebimento'
              : 'Editar Recebimento'}
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
        name="recebimentoForm"
        noValidate
        // onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <Controller
              control={control}
              name="aluno"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  // {...field}
                  className="mb-24"
                  fullWidth
                  required
                  options={alunos}
                  loading={alunos.length == 0 ? true : false}
                  getOptionLabel={(option) =>
                    `${option.nome} - ${option.abSerie} ${option.turma} - ${option.abFilial}`
                  }
                  renderOption={(option) => (
                    <>{`${option.nome} - ${option.abSerie} Turma ${option.turma} - ${option.abFilial}`}</>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Aluno"
                      variant="outlined"
                      required
                    />
                  )}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                />
              )}
            />
          </div>

          {arrayTipos.map((arTipo, index) => (
            <div className="flex" key={index}>
              <div className="min-w-48 pt-20">
                <Icon color="action">filter_alt</Icon>
              </div>
              <Controller
                control={control}
                name={arTipo.nameTipo}
                render={({ field }) => (
                  <TextField
                    // {...field}
                    value={field.value}
                    className="mb-24"
                    label="Recibo"
                    id={arTipo.idTipo}
                    variant="outlined"
                    fullWidth
                    select
                    multiple
                    required
                    onChange={(_, data) => {
                      let t = tipos.filter(
                        (tp) => tp.idRecebimentoTipo == data.props.value
                      );
                      setCount(count + 1);
                      let dataTipos = arrayTipos;
                      dataTipos[index] = {
                        idTipo: `recibo${count}`,
                        nameTipo: `tipo${count}`,
                        idValor: `valor${count}`,
                        nameValor: `valor${count}`,
                        id: t[0].idRecebimentoTipo,
                        tipo: t[0].tipo,
                        valor: t[0].valor,
                      };
                      setArrayTipos([...dataTipos]);
                      console.log(arrayTipos);
                      field.onChange(data.props.value);
                    }}
                  >
                    <MenuItem value={0}>Nenhum recibo selecionado</MenuItem>
                    {tipos.map((t, index) => (
                      <MenuItem key={index} value={t.idRecebimentoTipo}>
                        {t.tipo}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                control={control}
                name={arTipo.nameValor}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Valor"
                    id={arTipo.idValor}
                    defaultValue={arTipo.valor}
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(ev) => {
                      let valorReal = ev.target.value
                        .replace('R$', '')
                        .replace('.', '')
                        .replace('.', '')
                        .replace('.', '')
                        .replace(',', '.');
                      field.onChange(valorReal);
                      arTipo.valor = valorReal;
                      setArrayTipos([...arrayTipos]);
                      totalValue();
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                )}
              />
              <div className="min-w-50 mb-24">
                <IconButton onClick={() => rmTipo(arTipo)}>
                  <Icon color="action">remove</Icon>
                </IconButton>
              </div>
            </div>
          ))}

          {/* <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">filter_alt</Icon>
            </div>
            <Controller
              control={control}
              name="tipo"
              defaultValue={[]}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  // {...field}
                  className="mb-24"
                  label="Recibos"
                  id="recibos"
                  variant="outlined"
                  fullWidth
                  select
                  multiple
                  required
                  loading={tipos.length == 0 ? true : false}
                  options={tipos}
                  getOptionLabel={(option) =>
                    `${option.tipo} - ${option.valor}`
                  }
                  renderOption={(option) => (
                    <>{`${option.tipo} - ${option.valor}`}</>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Recibos"
                      variant="outlined"
                      required
                    />
                  )}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                    totalValue();
                  }}
                />
              )}
            />
          </div> */}

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">monetization_on</Icon>
            </div>
            <div className="min-w-48 pt-20">
              <Typography variant="h6">
                Total: {currencyFormatter(valueTotal)}
              </Typography>
            </div>
            <div className="px-16">
              <IconButton onClick={() => addTipo()}>
                <Icon color="action">add</Icon>
              </IconButton>
            </div>
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">note</Icon>
            </div>
            <Controller
              control={control}
              name="desc"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Descrição"
                  id="desc"
                  variant="outlined"
                  multiline
                  rows={5}
                  fullWidth
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
              Add
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default RecebimentoDialog;
