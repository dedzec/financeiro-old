import { lazy } from 'react';

const ReciboConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/Recibo',
      component: lazy(() => import('./ReciboApp')),
    },
  ],
};

export default ReciboConfig;
