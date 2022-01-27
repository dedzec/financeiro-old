import React from 'react';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import {
  setRecebimentosSearchText,
  openNewRecebimentoDialog,
} from './store/recebimentosSlice';

function RecebimentoHeader() {
  const dispatch = useDispatch();
  const searchText = useSelector(
    ({ recebimentosApp }) => recebimentosApp.recebimentos.searchText
  );
  const mainTheme = useSelector(selectMainTheme);

  return (
    <div className="flex flex-1 items-center justify-between p-4 sm:p-24">
      <div className="flex flex-shrink items-center sm:w-224">
        <div className="flex items-center">
          <Icon
            component={motion.span}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.2 } }}
            className="text-24 md:text-32"
          >
            money
          </Icon>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
          >
            Recebimentos
          </Typography>
        </div>
      </div>

      {/* <div className="flex flex-1 items-center justify-center px-8 sm:px-12"> */}
      <div className="flex flex-1 items-center justify-center px-12">
        <ThemeProvider theme={mainTheme}>
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex p-4 items-center w-full max-w-512 h-48 px-16 py-4 shadow"
          >
            <Icon color="action">search</Icon>

            <Input
              placeholder="Procure aqui"
              className="flex flex-1 px-16"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setRecebimentosSearchText(ev))}
            />
          </Paper>
        </ThemeProvider>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        <Button
          className="whitespace-nowrap"
          variant="contained"
          color="primary"
          onClick={() => dispatch(openNewRecebimentoDialog())}
        >
          <span className="hidden sm:flex">Add Novo Recibo</span>
          <span className="flex sm:hidden">New</span>
        </Button>
      </motion.div>
    </div>
  );
}

export default RecebimentoHeader;
