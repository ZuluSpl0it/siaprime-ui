import { ConnectedRouter } from 'connected-react-router'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { StoreContext } from 'redux-react-hook'

import Routes from '../routes'
import cs from '../store/configureStore'
import { theme } from '../theme'

const { configureStore, history } = cs
const store = configureStore()

const Root = () => (
  <Provider store={store}>
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  </Provider>
)

export default hot(module as any)(Root)
