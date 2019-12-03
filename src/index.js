import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components/App/App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter basename="/car-rental-system">
    <App/>
  </BrowserRouter>
  ,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
