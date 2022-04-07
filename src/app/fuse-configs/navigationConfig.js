import i18next from 'i18next';
import { authRoles } from 'app/auth';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'applications',
    title: 'Applications',
    translate: 'APLICAÇÕES',
    type: 'group',
    icon: 'apps',
    auth: authRoles.onlyGuest,
    children: [
      {
        id: 'login',
        title: 'Login',
        translate: 'LOGIN',
        type: 'item',
        icon: 'login',
        url: '/login',
        auth: authRoles.onlyGuest,
      },
      {
        id: 'recebimento',
        title: 'Recebimento',
        translate: 'RECEBIMENTO',
        type: 'item',
        icon: 'money',
        url: '/recebimento',
        auth: authRoles.financeiro,
      },
      {
        id: 'caixa',
        title: 'Caixa',
        translate: 'CAIXA',
        type: 'item',
        icon: 'account_balance_wallet',
        url: '/caixa',
        auth: authRoles.financeiro,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    translate: 'CONFIGURAÇÕES',
    type: 'group',
    icon: 'settings',
    auth: authRoles.financeiro,
    children: [
      {
        id: 'recibo',
        title: 'Recibo',
        translate: 'RECIBO',
        type: 'item',
        icon: 'filter_alt',
        url: '/recibo',
        auth: authRoles.financeiro,
      },
    ],
  },
];

export default navigationConfig;
