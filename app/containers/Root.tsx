import { ConnectedRouter } from 'connected-react-router'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { ThemeProvider, injectGlobal } from 'styled-components'
import { StoreContext } from 'redux-react-hook'

import Routes from '../routes'
import cs from '../store/configureStore'
import { theme } from '../theme'

const { configureStore, history } = cs
export const reduxStore = configureStore()

injectGlobal`
@font-face {
  font-family: Metropolis;
  src: url('../assets/fonts/Metropolis-Regular.ttf') format('ttf');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: Metropolis;
  src: url('../assets/fonts/Metropolis-Medium.otf') format('otf');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: Metropolis;
  src: url('../assets/fonts/Metropolis-Bold.otf') format('otf');
  font-weight: 800;
  font-style: normal;
}
`

const Root = () => (
  <Provider store={reduxStore}>
    <StoreContext.Provider value={reduxStore}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </ThemeProvider>
    </StoreContext.Provider>
  </Provider>
)

export default hot(module as any)(Root)
