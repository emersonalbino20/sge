import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './_redux/store'
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'
import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
)

/* <PrimeReactProvider value={{ unstyled: true }}>
    <ConfirmDialogProvider
    defaultOptions={{
      confirmText: 'Yes',
      cancelText: 'No',
      alertDialogContent: { className: 'my-default-dialog-class' }
    }}
    >
        <App />
    </ConfirmDialogProvider>
    </PrimeReactProvider>*/