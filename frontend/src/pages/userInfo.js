import React from 'react';
import { Provider } from 'react-redux';
import  UserInfo  from '../components/provider_userInfo';
import { store } from '../components/store';


const App = ({socket}) => (
  <Provider store={store}>
    <UserInfo socket={socket}/>
  </Provider>
);

export default App;
