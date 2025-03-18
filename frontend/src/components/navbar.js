import React from 'react';
import { Provider } from 'react-redux';
import Navbar from './provider_navbar';
import { store } from './store';


const App = () => (
  <Provider store={store}>
    <Navbar />
  </Provider>
);

export default App;
