import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from './config/web3';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <App/>
        </Web3ReactProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

