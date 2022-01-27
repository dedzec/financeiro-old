// Internet Explorer 11 requires polyfills and partially supported by this project.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-poppins';
import './i18n';
import './react-chartjs-2-defaults';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
import App from 'app/App';

ReactDOM.render(<App />, document.getElementById('root'));

module.hot.accept();
