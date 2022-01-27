import i18next from 'i18next';
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
    translate: 'APPLICATIONS',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'recebimento',
        title: 'Recebimento',
        translate: 'RECEBIMENTO',
        type: 'item',
        icon: 'money',
        url: '/recebimento',
      },
      {
        id: 'caixa',
        title: 'Caixa',
        translate: 'CAIXA',
        type: 'item',
        icon: 'account_balance_wallet',
        url: '/caixa',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    translate: 'SETTINGS',
    type: 'group',
    icon: 'settings',
    children: [
      {
        id: 'recibo',
        title: 'Recibo',
        translate: 'RECIBO',
        type: 'item',
        icon: 'filter_alt',
        url: '/recibo',
      },
    ],
  },
];

export default navigationConfig;
