import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/errors/404/Error404Page';
import RecebimentoConfig from 'app/main/recebimento/RecebimentoConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import CaixaConfig from 'app/main/caixa/CaixaConfig';
import ReciboConfig from 'app/main/recibo/ReciboConfig';

const routeConfigs = [
  LoginConfig,
  CaixaConfig,
  RecebimentoConfig,
  ReciboConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, [
    'admin',
    'gestor',
    'financeiro',
  ]),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/recebimento" />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
