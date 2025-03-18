import UpdateForm from "../components/provider_update";
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../components/store';

const Update = ({socket}) => (
    <Provider store={store}>
      <UpdateForm socket={socket}/>
    </Provider>
  );
  
  export default Update;     