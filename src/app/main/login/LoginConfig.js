// import { lazy } from 'react';
import { authRoles } from 'app/auth';
import Login from './Login';

const LoginConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: true,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/login',
      component: Login,
      // component: lazy(() => import('./Login')),
    },
  ],
};

export default LoginConfig;
