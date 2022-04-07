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
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

// import _ from '@lodash';
import * as yup from 'yup';

import FormatDate from '../pdf/helpers/format-date';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { selectCaixa, closeRelatorioDialog } from './store/caixaSlice';

import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';

const defaultValues = {
  dtInicio: new Date('2022-01-01T11:11:11'),
  dtFim: new Date(),
  recibos: [],
  order: 'turma',
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
  const formatDate = new FormatDate();
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const dispatch = useDispatch();
  // const user = useSelector(({ auth }) => auth.user);
  const data = useSelector(selectCaixa);
  const recibos = useSelector(({ caixaApp }) => caixaApp.tipos);
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
      const dtInicio = getValues('dtInicio');
      const dtFim = getValues('dtFim');

      let alunos = data.filter(
        (el) =>
          new Date(el.createdAt) >= new Date(dtInicio) &&
          new Date(el.createdAt) <= new Date(dtFim)
      );
      console.log('Alunos', alunos);

      const recibos = getValues('recibos');

      let alunosArray = [];
      if (recibos.length > 0) {
        alunos.forEach((al) => {
          al.tipos.forEach((tipo) => {
            recibos.map((recibo) => {
              if (tipo.idRecebimentoTipo == recibo.idRecebimentoTipo) {
                alunosArray.push({
                  data: al.createdAt,
                  aluno: al.nome,
                  recibo: tipo.tipo,
                  valor: tipo.valor,
                  desc: al.descricao,
                  usuario: al.usuario,
                  turma: al.turma,
                  serie: al.abSerie,
                  filial: al.abFilial,
                });
              }
            });
          });
        });
      } else {
        alunos.forEach((al) => {
          al.tipos.forEach((tipo) => {
            alunosArray.push({
              data: al.createdAt,
              aluno: al.nome,
              recibo: tipo.tipo,
              valor: tipo.valor,
              desc: al.descricao,
              usuario: al.usuario,
              turma: al.turma,
              serie: al.abSerie,
              filial: al.abFilial,
            });
          });
        });
      }

      const alunosFilter = alunosArray.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null));
      const alunosSort = alunosFilter.sort((a, b) => {
        return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
      });

      // console.log('alunosSort', alunosSort);
      const arrayData = [];
      const arrayFilter = [];

      const order = getValues('order');
      let totalGeral = 0;
      switch (order) {
        case 'geral':
          arrayData.push([
            'Data',
            'Aluno',
            'Recibo',
            'Valor',
            'Desc',
            'Usuario',
            'Turma',
            'Serie',
            'Filial',
          ]);
          alunosSort.forEach((al) => {
            arrayData.push([
              al.data,
              al.aluno,
              al.recibo,
              al.valor,
              al.desc,
              al.usuario,
              al.turma,
              al.serie,
              al.filial,
            ]);
            totalGeral += parseFloat(al.valor);
          });
          arrayData.push(['TOTAL GERAL', '-', '-', totalGeral]);
          break;
        case 'filial':
          alunosSort.forEach((al) => {
            arrayFilter.push([al.filial]);
          });
          // eslint-disable-next-line no-case-declarations
          let filialFilter = arrayFilter.filter(function (a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
          }, Object.create(null));
          filialFilter.forEach((filial) => {
            console.log(filial[0]);
            arrayData.push([filial[0]]);
            arrayData.push([
              'Data',
              'Aluno',
              'Recibo',
              'Valor',
              'Desc',
              'Usuario',
              'Turma',
              'Serie',
              // 'Filial',
            ]);
            let total = 0;
            alunosSort.forEach((al) => {
              if (al.filial == filial[0]) {
                arrayData.push([
                  al.data,
                  al.aluno,
                  al.recibo,
                  al.valor,
                  al.desc,
                  al.usuario,
                  al.turma,
                  al.serie,
                  // al.filial,
                ]);
                total += parseFloat(al.valor);
              }
            });
            arrayData.push([`TOTAL ${filial[0]}`, '-', '-', total]);
            totalGeral += parseFloat(total);
          });
          arrayData.push(['TOTAL GERAL', '-', '-', totalGeral]);
          break;
        case 'serie':
          alunosSort.forEach((al) => {
            arrayFilter.push([al.filial, al.serie]);
          });
          // eslint-disable-next-line no-case-declarations
          let serieFilter = arrayFilter.filter(function (a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
          }, Object.create(null));
          serieFilter.forEach((serie) => {
            console.log(serie[0], serie[1]);
            arrayData.push([serie[1], serie[0]]);
            arrayData.push([
              'Data',
              'Aluno',
              'Recibo',
              'Valor',
              'Desc',
              'Usuario',
              'Turma',
              // 'Serie',
              // 'Filial',
            ]);
            let total = 0;
            alunosSort.forEach((al) => {
              if (al.filial == serie[0] && al.serie == serie[1]) {
                arrayData.push([
                  al.data,
                  al.aluno,
                  al.recibo,
                  al.valor,
                  al.desc,
                  al.usuario,
                  al.turma,
                  // al.serie,
                  // al.filial,
                ]);
                total += parseFloat(al.valor);
              }
            });
            arrayData.push([`TOTAL ${serie[1]} ${serie[0]}`, '-', '-', total]);
            totalGeral += parseFloat(total);
          });
          arrayData.push(['TOTAL GERAL', '-', '-', totalGeral]);
          break;
        case 'turma':
          alunosSort.forEach((al) => {
            arrayFilter.push([al.filial, al.serie, al.turma]);
          });
          // eslint-disable-next-line no-case-declarations
          let turmaFilter = arrayFilter.filter(function (a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
          }, Object.create(null));
          turmaFilter.forEach((turma) => {
            console.log(turma[0], turma[1], turma[2]);
            arrayData.push([turma[1], turma[2], turma[0]]);
            arrayData.push([
              'Data',
              'Aluno',
              'Recibo',
              'Valor',
              'Desc',
              'Usuario',
              // 'Turma',
              // 'Serie',
              // 'Filial',
            ]);
            let total = 0;
            alunosSort.forEach((al) => {
              if (
                al.filial == turma[0] &&
                al.serie == turma[1] &&
                al.turma == turma[2]
              ) {
                arrayData.push([
                  al.data,
                  al.aluno,
                  al.recibo,
                  al.valor,
                  al.desc,
                  al.usuario,
                  // al.turma,
                  // al.serie,
                  // al.filial,
                ]);
                total += parseFloat(al.valor);
              }
            });
            arrayData.push([
              `TOTAL ${turma[1]} ${turma[2]} ${turma[0]}`,
              '-',
              '-',
              total,
            ]);
            totalGeral += parseFloat(total);
          });
          arrayData.push(['TOTAL GERAL', '-', '-', totalGeral]);
          break;
      }

      // console.log('arrayData', arrayData);

      // let buscar = 'null';
      // arrayData.forEach((ar) => {
      //   let indice = ar.indexOf(buscar);
      //   while (indice >= 0) {
      //     ar.splice(indice, 1);
      //     indice = ar.indexOf(buscar);
      //   }
      //   // indice = ar.indexOf(buscar);
      //   // console.log('Array', ar);
      // });

      // console.log(arrayData);

      return exportToCSV(arrayData, `relatorio_${formatDate.todayDateTime()}`);
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
              <Icon color="action">today</Icon>
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                control={control}
                name="dtInicio"
                render={({ field: { onChange, value } }) => (
                  <KeyboardDateTimePicker
                    // {...field}
                    ampm={false}
                    label="Data Inicial"
                    format="dd/MM/yyyy HH:mm"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      // verifyRecibos();
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                )}
              />
            </MuiPickersUtilsProvider>

            <div className="mx-8 hidden sm:flex">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Controller
                  control={control}
                  name="dtFim"
                  render={({ field: { onChange, value } }) => (
                    <KeyboardDateTimePicker
                      // {...field}
                      ampm={false}
                      label="Data Final"
                      format="dd/MM/yyyy HH:mm"
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        // verifyRecibos();
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  )}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>

          <div className="flex sm:hidden">
            <div className="min-w-48 pt-20">
              <Icon color="action">today</Icon>
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                control={control}
                name="dtFim"
                render={({ field: { onChange, value } }) => (
                  <KeyboardDateTimePicker
                    // {...field}
                    ampm={false}
                    label="Date Final"
                    format="dd/MM/yyyy HH:mm"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      // verifyRecibos();
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className="flex mt-8">
            <div className="min-w-48 pt-20">
              <Icon color="action">label</Icon>
            </div>
            <Controller
              control={control}
              name="recibos"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  // {...field}
                  className="mb-24"
                  fullWidth
                  required
                  multiple
                  options={recibos}
                  loading={recibos.length == 0 ? true : false}
                  getOptionLabel={(option) => `${option.tipo}`}
                  renderOption={(option) => <>{`${option.tipo}`}</>}
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
                  }}
                />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">filter_alt</Icon>
            </div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Ordenar por</FormLabel>
              <Controller
                name="order"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} aria-label="order" row>
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
