import { lazy } from 'react';

const RecebimentoConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/Recebimento',
      component: lazy(() => import('./RecebimentoApp')),
    },
  ],
};

export default RecebimentoConfig;
