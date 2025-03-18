import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';

import AsideNav from './components/asideNav.js';
import {HashRouter} from "react-router-dom";
import socketIO from "socket.io-client";


import './App.css';


var socket = socketIO(process.env.REACT_APP_NODE_URL, {
  withCredentials: true,
  cors: {
      origin: "*",
      credentials: true,
  },
  path: "/",
  transports: ["websocket"],
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <HashRouter>
        <AsideNav socket={socket}></AsideNav>
      </HashRouter>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
