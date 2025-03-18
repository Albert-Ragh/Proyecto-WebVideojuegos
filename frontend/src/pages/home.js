import React from 'react';
import { Provider } from 'react-redux';
import Home from '../components/provider_home';
import { store } from '../components/store';


const App = () => (
    <Provider store={store}>
      <Home />
    </Provider>
  );

export default App;
