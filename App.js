import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store';

import Wrapper from './src/app';

const App = () => {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
};

export default App;
