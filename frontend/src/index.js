import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Routers from './routers';
import './styles/main.scss';
import './styles/variables.scss';
import 'react-phone-number-input/style.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import reportWebVitals from './reportWebVitals';

render(
  <React.StrictMode>
    <Provider store={store}>
      <Routers />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
