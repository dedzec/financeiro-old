import { lazy } from 'react';

const CaixaConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/Caixa',
      component: lazy(() => import('./CaixaApp')),
    },
  ],
};

export default CaixaConfig;
