import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProviderWrapper } from './utils/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import api from './api'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <QueryClientProviderWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProviderWrapper>
  </Provider>
);