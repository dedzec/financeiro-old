import React, { useCallback, useEffect, useState } from 'react';
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
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import { selectCaixa, closeListDialog } from './store/caixaSlice';

import lista from '../pdf/lista';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';

const defaultValues = {
  dtInicio: new Date('2022-01-01T11:11:11'),
  dtFim: new Date(),
  recibos: [],
  turma: '0',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  dtInicio: yup.string().required('Data inicial não informada!'),
  dtFim: yup.string().required('Data final não informada!'),
  recibos: yup.string().required('Recibos não informados!'),
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

const ListDialog = () => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const dispatch = useDispatch();
  // const user = useSelector(({ auth }) => auth.user);
  const data = useSelector(selectCaixa);
  const recibos = useSelector(({ caixaApp }) => caixaApp.tipos);
  const listDialog = useSelector(({ caixaApp }) => caixaApp.caixa.listDialog);
  const [turmas, setTurmas] = useState([]);

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
    if (listDialog.type === 'edit' && listDialog.data) {
      reset({ ...listDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (listDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...listDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [listDialog.data, listDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (listDialog.props.open) {
      initDialog();
    }
  }, [listDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    setTurmas([]);
    return dispatch(closeListDialog());
  }

  /**
   * Notification
   */
  function createNotification(obj) {
    dispatch(addNotification(NotificationModel(obj)));
  }

  const verifyRecibos = () => {
    const recibos = getValues('recibos');
    const dtInicio = getValues('dtInicio');
    const dtFim = getValues('dtFim');

    console.log('recibos', recibos);

    if (recibos.length > 0) {
      let turmas = [];
      data.forEach((el) => {
        if (
          new Date(el.createdAt) >= new Date(dtInicio) &&
          new Date(el.createdAt) <= new Date(dtFim)
        ) {
          el.tipos.forEach((tipo) => {
            recibos.forEach((recibo) => {
              if (tipo.idRecebimentoTipo == recibo.idRecebimentoTipo) {
                turmas.push({
                  idFilial: el.idFilial,
                  filial: el.abFilial,
                  idSerie: el.idSerie,
                  serie: el.abSerie,
                  idTurma: el.idTurma,
                  turma: el.turma,
                  // recibo: tipo.tipo,
                });
              }
            });
          });
        }
      });

      const turmasFilter = turmas.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null));

      const turmasSort = turmasFilter.sort((a, b) => {
        return `${a.serie}${a.turma}` < `${b.serie}${b.turma}`
          ? -1
          : `${a.serie}${a.turma}` > `${b.serie}${b.turma}`
          ? 1
          : 0;
      });

      setTurmas(turmasSort);
    } else {
      setTurmas([]);
    }
  };

  // eslint-disable-next-line no-unused-vars
  // const pdf = (recibos, dtInicio, dtFim) => {
  //   try {
  //     let nameRecibos = '';
  //     recibos.forEach((recibo, index) => {
  //       if (index == 0) nameRecibos = `${recibo.tipo}`;
  //       else nameRecibos = `${nameRecibos} / ${recibo.tipo}`;
  //     });

  //     let turmas = [];
  //     let alunos = [];
  //     data.forEach((el) => {
  //       if (
  //         new Date(el.createdAt) >= new Date(dtInicio) &&
  //         new Date(el.createdAt) <= new Date(dtFim)
  //       ) {
  //         el.tipos.forEach((tipo) => {
  //           recibos.forEach((recibo) => {
  //             if (tipo.idRecebimentoTipo == recibo.idRecebimentoTipo) {
  //               alunos.push({
  //                 ra: el.ra,
  //                 nome: el.nome,
  //                 idSerie: el.idSerie,
  //                 serie: el.abSerie,
  //                 idTurma: el.idTurma,
  //                 turma: el.turma,
  //                 // recibo: tipo.tipo,
  //               });
  //               turmas.push({
  //                 idFilial: el.idFilial,
  //                 filial: el.abFilial,
  //                 idSerie: el.idSerie,
  //                 serie: el.abSerie,
  //                 idTurma: el.idTurma,
  //                 turma: el.turma,
  //                 // recibo: tipo.tipo,
  //               });
  //             }
  //           });
  //         });
  //       }
  //     });

  //     const turmasFilter = turmas.filter(function (a) {
  //       return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
  //     }, Object.create(null));
  //     // const data = { turmas: turmasFilter, alunos: alunos };
  //     turmasFilter.forEach((turma, index) => {
  //       let alunosFilter = alunos.filter(
  //         (aluno) => aluno.idTurma == turma.idTurma
  //       );
  //       let alunosSort = alunosFilter.sort((a, b) => {
  //         return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
  //       });
  //       const data = { recibos: nameRecibos, turma: turma, alunos: alunosSort };

  //       setTimeout(() => {
  //         pdfMake.createPdf(lista(data)).open();
  //       }, 600 + index * 200);
  //     });

  //     // let index = 0;
  //     // let interval = setInterval(() => {
  //     //   if (index < docArray.length) {
  //     //     // docArray here is array of docs contents
  //     //     pdfMake.createPdf(lista(docArray[index])).open();
  //     //     index++;
  //     //   } else {
  //     //     clearInterval(interval);
  //     //   }
  //     // }, 200);

  //     createNotification({
  //       message: 'Lista(s) Gerada(s) com Sucesso!',
  //       options: { variant: 'success' },
  //     });
  //   } catch (err) {
  //     createNotification({
  //       message: err.response.data,
  //       options: { variant: 'warning' },
  //     });
  //   }
  // };

  const pdf = (recibos, dtInicio, dtFim, turma) => {
    try {
      let nameRecibos = '';
      recibos.forEach((recibo, index) => {
        if (index == 0) nameRecibos = `${recibo.tipo}`;
        else nameRecibos = `${nameRecibos} / ${recibo.tipo}`;
      });

      let turmaInfo = null;
      let alunos = [];
      data.forEach((el) => {
        if (
          new Date(el.createdAt) >= new Date(dtInicio) &&
          new Date(el.createdAt) <= new Date(dtFim)
        ) {
          if (el.idTurma == turma) {
            el.tipos.forEach((tipo) => {
              recibos.forEach((recibo) => {
                if (tipo.idRecebimentoTipo == recibo.idRecebimentoTipo) {
                  alunos.push({
                    ra: el.ra,
                    nome: el.nome,
                    idSerie: el.idSerie,
                    serie: el.abSerie,
                    idTurma: el.idTurma,
                    turma: el.turma,
                    // recibo: tipo.tipo,
                  });
                  if (turmaInfo == null) {
                    turmaInfo = {
                      idFilial: el.idFilial,
                      filial: el.abFilial,
                      idSerie: el.idSerie,
                      serie: el.abSerie,
                      idTurma: el.idTurma,
                      turma: el.turma,
                      // recibo: tipo.tipo,
                    };
                  }
                }
              });
            });
          }
        }
      });

      const alunosFilter = alunos.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null));
      const alunosSort = alunosFilter.sort((a, b) => {
        return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
      });

      pdfMake
        .createPdf(
          lista({ recibos: nameRecibos, turma: turmaInfo, alunos: alunosSort })
        )
        .open();

      createNotification({
        message: 'Lista(s) Gerada(s) com Sucesso!',
        options: { variant: 'success' },
      });
    } catch (err) {
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
    }
  };

  /**
   * Form Submit
   */
  const onSubmit = () => {
    try {
      const recibos = getValues('recibos');
      const dtInicio = getValues('dtInicio');
      const dtFim = getValues('dtFim');
      const turma = getValues('turma');
      if (turma != '0') {
        pdf(recibos, dtInicio, dtFim, turma);
      } else {
        createNotification({
          message: 'Selecione a Turma',
          options: { variant: 'warning' },
        });
      }
    } catch (err) {
      console.log(err);
    }
    // closeComposeDialog();
  };

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...listDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="md"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {listDialog.type === 'new' ? 'Gerar Listas' : 'Gerar Listas'}
          </Typography>
          {/* <div className="grow" />
          <IconButton
            aria-label="toggle pass visibility"
            onClick={closeComposeDialog}
          >
            <Icon fontSize="inherit">close</Icon>
          </IconButton> */}
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
                    label="Date Inicial"
                    format="dd/MM/yyyy HH:mm"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      verifyRecibos();
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className="flex">
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
                      verifyRecibos();
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className="flex">
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
                      label="Recibo"
                      variant="outlined"
                      required
                    />
                  )}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                    verifyRecibos();
                  }}
                />
              )}
            />
          </div>

          {turmas.length > 0 ? (
            <div className="flex">
              <div className="min-w-48 pt-20">
                <Icon color="action">filter_alt</Icon>
              </div>
              <FormControl component="fieldset">
                <FormLabel component="legend">Filtrar por</FormLabel>
                <Controller
                  name="turma"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} aria-label="filtro" row>
                      {turmas.map((t, index) => (
                        <FormControlLabel
                          key={index}
                          value={`${t.idTurma}`}
                          control={<Radio />}
                          label={`${t.serie} ${t.turma} - ${t.filial}`}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </div>
          ) : (
            ''
          )}
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
              Gerar
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ListDialog;
