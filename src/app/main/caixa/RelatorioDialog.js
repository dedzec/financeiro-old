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
import Icon from '@material-ui/core/Icon';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// import _ from '@lodash';
import * as yup from 'yup';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { selectCaixa, closeRelatorioDialog } from './store/caixaSlice';

import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';

const defaultValues = {
  ano: '',
  filtro: 'turma',
  nome: true,
  data: false,
  valor: true,
  desc: true,
  turma: false,
  serie: false,
  filial: false,
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

const RelatorioDialog = () => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const dispatch = useDispatch();
  // const user = useSelector(({ auth }) => auth.user);
  const data = useSelector(selectCaixa);
  const relatorioDialog = useSelector(
    ({ caixaApp }) => caixaApp.caixa.relatorioDialog
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
    if (relatorioDialog.type === 'edit' && relatorioDialog.data) {
      reset({ ...relatorioDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (relatorioDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...relatorioDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [relatorioDialog.data, relatorioDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (relatorioDialog.props.open) {
      initDialog();
    }
  }, [relatorioDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return dispatch(closeRelatorioDialog());
  }

  /**
   * Notification
   */
  function createNotification(obj) {
    dispatch(addNotification(NotificationModel(obj)));
  }

  // eslint-disable-next-line no-unused-vars
  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  /**
   * Form Submit
   */
  const onSubmit = () => {
    try {
      let dataE = data;
      const filters = getValues();

      dataE = dataE.filter((d) => d);
      console.log(dataE);

      switch (filters.filtro) {
        case 'geral':
          break;
        case 'filial':
          break;
        case 'serie':
          break;
        case 'turma':
          break;
      }

      // return exportToCSV(data, 'relatorio');
    } catch (err) {
      console.log(err);
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
    }

    // dispatch(addRecebimento({ data: data, user: user }));
    // closeComposeDialog();
  };

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...relatorioDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="md"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {relatorioDialog.type === 'new'
              ? 'Gerar Relatório'
              : 'Editar Relatório'}
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
            <div className="min-w-48 pt-20">
              <Icon color="action">date_range</Icon>
            </div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Data de</FormLabel>
              <Controller
                name="ano"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Ano"
                    id="ano"
                    error={!!errors.login}
                    helperText={errors?.login?.message}
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    da
                  />
                )}
              />
            </FormControl>
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">filter_alt</Icon>
            </div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Filtrar por</FormLabel>
              <Controller
                name="filtro"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} aria-label="filtro" row>
                    <FormControlLabel
                      value="geral"
                      control={<Radio />}
                      label="Geral"
                    />
                    <FormControlLabel
                      value="filial"
                      control={<Radio />}
                      label="Filial"
                    />
                    <FormControlLabel
                      value="serie"
                      control={<Radio />}
                      label="Série"
                    />
                    <FormControlLabel
                      value="turma"
                      control={<Radio />}
                      label="Turma"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">view_column</Icon>
            </div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Campos Selecionados</FormLabel>
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  label={'Nome do Aluno'}
                  control={
                    <Controller
                      name="nome"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label={'Data'}
                  control={
                    <Controller
                      name="data"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label={'Valor'}
                  control={
                    <Controller
                      name="valor"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label={'Observação'}
                  control={
                    <Controller
                      name="desc"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label={'Turma'}
                  control={
                    <Controller
                      name="turma"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label={'Série'}
                  control={
                    <Controller
                      name="serie"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
                <FormControlLabel
                  label={'Filial'}
                  control={
                    <Controller
                      name="filial"
                      type="checkbox"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value}
                          onChange={(_, data) => onChange(data)}
                        />
                      )}
                    />
                  }
                />
              </FormGroup>
            </FormControl>
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
              Gerar
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RelatorioDialog;
