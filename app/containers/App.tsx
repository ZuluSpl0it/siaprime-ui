import { siad, initSiad, launchSiad } from 'api/siad'
import * as React from 'react'
import { reduxStore } from './Root'
import { connect, DispatchProp } from 'react-redux'
import { GlobalActions } from 'actions'
import {} from 'styled-components/cssprop'
import { defaultConfig } from 'config'
import { createGlobalStyle } from 'styled-components'

let process = null

const GlobalStyle = createGlobalStyle`
    /* total width */
  ::-webkit-scrollbar {
      background-color:#fff;
      width:16px
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
      background-color:#fff
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:4px solid #fff
  }

  /* set button(top and bottom of the scrollbar) */
  ::-webkit-scrollbar-button {display:none}
  ::-webkit-scrollbar {     
        background-color: #fff;
        width: .8em
  }
`

window.addEventListener('beforeunload', async e => {
  if (process) {
    await siad.daemonStop()
  }
})

class App extends React.Component<DispatchProp> {
  componentDidMount = async () => {
    const { dispatch } = this.props
    const isRunning = await siad.isRunning()
    dispatch(GlobalActions.startPolling())
    // If not running, we'll try to launch siad ourselves
    // setTimeout(async () => {
    if (!isRunning) {
      dispatch(GlobalActions.siadLoading())
      const loadedProcess: any = await launchSiad()
      if (loadedProcess) {
        process = loadedProcess
        dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
        dispatch(GlobalActions.siadLoaded())
      } else {
        dispatch(GlobalActions.siadOffline())
      }
    } else {
      dispatch(GlobalActions.setSiadOrigin({ isInternal: false }))
      dispatch(GlobalActions.siadLoaded())
    }
    // }, 3000)
  }
  render() {
    return (
      <React.Fragment>
        <div>{this.props.children}</div>
        <GlobalStyle />
      </React.Fragment>
    )
  }
}

export default connect()(App)
