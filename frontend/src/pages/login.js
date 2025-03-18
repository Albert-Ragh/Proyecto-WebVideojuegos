import React from 'react';
import { Provider } from 'react-redux';
import LoginForm from '../components/provider_login';
import { store } from '../components/store';

const App = () => (
  <Provider store={store}>
    <LoginForm />
  </Provider>
);

export default App;
