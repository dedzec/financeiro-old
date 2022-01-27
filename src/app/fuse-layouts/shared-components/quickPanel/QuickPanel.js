import React, { memo, useEffect, useState } from 'react';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import reducer from './store';
import { getData } from './store/dataSlice';
import { toggleQuickPanel } from './store/stateSlice';

const useStyles = makeStyles(() => ({
  root: {
    width: 280,
  },
}));

function QuickPanel() {
  const dispatch = useDispatch();
  const data = useSelector(({ quickPanel }) => quickPanel.data);
  const state = useSelector(({ quickPanel }) => quickPanel.state);

  // const option = {
  //   year: 'numeric',
  //   month: 'long' || 'short' || 'numeric',
  //   weekday: 'long' || 'short',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric',
  //   era: 'long' || 'short',
  //   timeZoneName: 'long' || 'short',
  // };
  // const locale = 'pt-br';
  // const date = new Date().toLocaleDateString(locale, option);

  const classes = useStyles();
  const [checked, setChecked] = useState('notifications');

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  const upperText = (text) => {
    return text
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <SwipeableDrawer
      classes={{ paper: classes.root }}
      open={state}
      anchor="right"
      onOpen={() => {}}
      onClose={() => dispatch(toggleQuickPanel())}
      disableSwipeToOpen
    >
      <FuseScrollbars>
        <ListSubheader component="div">Hoje</ListSubheader>

        <div className="mb-0 py-16 px-24">
          <Typography className="mb-12 text-32" color="textSecondary">
            {/* {new Intl.DateTimeFormat('en-US').format(date, 'eeee')} */}
            {upperText(format(new Date(), 'eee', { locale: ptBR }))}
          </Typography>
          <div className="flex">
            <Typography className="leading-none text-32" color="textSecondary">
              {upperText(format(new Date(), 'dd', { locale: ptBR }))}
            </Typography>
            <Typography className="leading-none text-16" color="textSecondary">
              th
            </Typography>
            <Typography className="leading-none text-32" color="textSecondary">
              {upperText(format(new Date(), 'MMMM', { locale: ptBR }))}
            </Typography>
          </div>
        </div>
        <Divider />
        <List>
          <ListSubheader component="div">Eventos</ListSubheader>
          {data &&
            data.events.map((event) => (
              <ListItem key={event.id}>
                <ListItemText primary={event.title} secondary={event.detail} />
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div">Notas</ListSubheader>
          {data &&
            data.notes.map((note) => (
              <ListItem key={note.id}>
                <ListItemText primary={note.title} secondary={note.detail} />
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div">Configurações Rápidas</ListSubheader>
          <ListItem>
            <ListItemIcon className="min-w-40">
              <Icon>notifications</Icon>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <ListItemSecondaryAction>
              <Switch
                color="primary"
                onChange={handleToggle('notifications')}
                checked={checked.indexOf('notifications') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          {/* <ListItem>
            <ListItemIcon className="min-w-40">
              <Icon>cloud</Icon>
            </ListItemIcon>
            <ListItemText primary="Cloud Sync" />
            <ListItemSecondaryAction>
              <Switch
                color="secondary"
                onChange={handleToggle('cloudSync')}
                checked={checked.indexOf('cloudSync') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon className="min-w-40">
              <Icon>brightness_high</Icon>
            </ListItemIcon>
            <ListItemText primary="Retro Thrusters" />
            <ListItemSecondaryAction>
              <Switch
                color="primary"
                onChange={handleToggle('retroThrusters')}
                checked={checked.indexOf('retroThrusters') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem> */}
        </List>
      </FuseScrollbars>
    </SwipeableDrawer>
  );
}

export default withReducer('quickPanel', reducer)(memo(QuickPanel));
