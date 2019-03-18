import * as React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { StoreContext } from 'redux-react-hook'
import { ThemeProvider } from 'styled-components'

import Routes from '../routes'
import cs from '../store/configureStore'
import { theme } from '../theme'
import { GlobalStyle } from './App'

const { configureStore, history } = cs
export const reduxStore = configureStore()

const Root = () => (
  <Provider store={reduxStore}>
    <StoreContext.Provider value={reduxStore}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <Router history={history}>
            <Routes />
          </Router>
        </>
      </ThemeProvider>
    </StoreContext.Provider>
  </Provider>
)

export default Root
