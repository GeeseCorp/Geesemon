import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './behavior/store';
import { ApolloProvider } from '@apollo/client';
import { client } from './behavior/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import 'antd/dist/antd.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Provider>,
);
