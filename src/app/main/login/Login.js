import React, { useState, memo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Checkbox from '@material-ui/core/Checkbox';
// import Divider from '@material-ui/core/Divider';
// import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
// import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
// import { addNotification } from './store/dataSlice';
import { setUserData } from 'app/auth/store/userSlice';
import { loginSuccess } from 'app/auth/store/loginSlice';

// import { submitLogin } from 'app/auth/store/loginSlice';

import apiUrl from 'api';

import reducer from 'app/fuse-layouts/shared-components/notificationPanel/store';
import NotificationModel from 'app/fuse-layouts/shared-components/notificationPanel/model/NotificationModel';
import { addNotification } from 'app/fuse-layouts/shared-components/notificationPanel/store/dataSlice';

const useStyles = makeStyles(() => ({
  root: {},
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  login: yup.string().required('Você deve inserir um login'),
  password: yup
    .string()
    .required('Por favor, insira sua senha.')
    .min(4, 'A senha é muito curta - deve ter no mínimo 4 caracteres.'),
});

const defaultValues = {
  // login: '',
  // password: '',
  login: '',
  password: '',
  remember: true,
};

function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  /*
  Add Notifications for demonstration
   */
  function createNotification(obj) {
    dispatch(addNotification(NotificationModel(obj)));
  }

  const handleClickShowPass = () => {
    setShowPass(!showPass);
  };

  async function onSubmit(data) {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/signin`, {
        login: data.login,
        pass: data.password,
      });
      createNotification({
        message: 'Login Efetuado com Sucesso',
        options: { variant: 'success' },
      });
      dispatch(
        setUserData({
          ...res.data,
          role: res.data.perfilUsuario,
          data: {
            displayName: res.data.nome,
            // photoURL: '/',
            email: 'lucasleal.pro@gmail.com',
            shortcuts: ['calendar'],
          },
        })
      );
      reset(defaultValues);
      setTimeout(() => {
        setLoading(false);
        // props.onToggleAutentication(res.data);
        dispatch(loginSuccess());
      }, 500);
    } catch (err) {
      console.log(err);
      createNotification({
        message: err.response.data,
        options: { variant: 'warning' },
      });
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  // function onSubmit(model) {
  //   dispatch(submitLogin(model));
  //   createNotification({
  //     message: 'Login Efetuado com Sucesso',
  //     options: { variant: 'success' },
  //   });
  //   reset(defaultValues);
  // }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto p-16 sm:p-24 md:flex-row md:p-0 overflow-hidden'
      )}
    >
      <div className="flex flex-col flex-grow-0 items-center p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
        >
          <img
            className="w-128 mb-32"
            src="assets/images/logos/idb.png"
            alt="logo"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <Typography className="text-32 sm:text-44 font-semibold leading-tight">
            Bem Vindo <br />
            ao <br /> Idb App!
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography variant="subtitle1" className="mt-32 font-medium">
            Modelo de administrador poderoso e profissional para aplicativos da
            Web, CRM, CMS, painéis de administração e muito mais.
          </Typography>
        </motion.div>
      </div>

      <Card
        component={motion.div}
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ bounceDamping: 0 }}
        className="w-full max-w-400 mx-auto m-16 md:m-0 rounded-20 md:rounded-none"
        square
        layout
      >
        <CardContent className="flex flex-col items-center justify-center p-16 sm:p-32 md:p-48 md:pt-128 ">
          <Typography
            variant="h6"
            className="mb-24 font-semibold text-18 sm:text-24"
          >
            Faça login na sua conta
          </Typography>

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="login"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Login"
                  autoFocus
                  type="text"
                  error={!!errors.login}
                  helperText={errors?.login?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl
                  className="mb-16"
                  variant="outlined"
                  error={!!errors.password}
                >
                  <InputLabel htmlFor="pass">Senha *</InputLabel>
                  <OutlinedInput
                    {...field}
                    id="pass"
                    label="Password"
                    type={showPass ? 'text' : 'password'}
                    required
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle pass visibility"
                          onClick={handleClickShowPass}
                          // onMouseDown={handleMouseDownPass}
                        >
                          {showPass ? (
                            <Icon fontSize="inherit">visibility</Icon>
                          ) : (
                            <Icon fontSize="inherit">visibility_off</Icon>
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="outlined-weight-helper-text">
                    {errors?.password?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Remember Me"
                      control={<Checkbox {...field} />}
                    />
                  </FormControl>
                )}
              />

              <Link className="font-normal" to="/pages/auth/forgot-password-2">
                Forgot Password?
              </Link>
            </div> */}

            <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              aria-label="LOG IN"
              disabled={_.isEmpty(dirtyFields) || !isValid || loading}
              type="submit"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// export default Login;
export default withReducer('notificationPanel', reducer)(memo(Login));
