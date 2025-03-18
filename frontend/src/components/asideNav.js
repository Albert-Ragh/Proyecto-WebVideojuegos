import React from 'react';
import { Provider } from 'react-redux';
import AsideNav from './provider_asideNav';
import { store } from './store';


const App = ({socket}) => (
  <Provider store={store}>
    <AsideNav socket={socket}/>
  </Provider>
);

export default App;