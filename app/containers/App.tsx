import { siad, initSiad, launchSiad } from 'api/siad'
import * as React from 'react'
import { reduxStore } from './Root'
import { connect, DispatchProp } from 'react-redux'
import { GlobalActions } from 'actions'
import {} from 'styled-components/cssprop'
import { defaultConfig } from 'config'

let process = null

window.addEventListener('beforeunload', async e => {
  if (process) {
    await siad.daemonStop()
  }
})

class App extends React.Component<DispatchProp> {
  componentDidMount = async () => {
    const { dispatch } = this.props
    const isRunning = await siad.isRunning()
    // If not running, we'll try to launch siad ourselves
    setTimeout(async () => {
      if (!isRunning) {
        dispatch(GlobalActions.siadLoading())
        const loadedProcess: any = await launchSiad()
        if (loadedProcess) {
          process = loadedProcess
          dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
          setTimeout(() => {
            dispatch(GlobalActions.siadLoaded())
          }, 2000)
        } else {
          dispatch(GlobalActions.siadOffline())
        }
      } else {
        dispatch(GlobalActions.setSiadOrigin({ isInternal: false }))
        dispatch(GlobalActions.siadLoaded())
      }
    }, 3000)
  }
  render() {
    return <div>{this.props.children}</div>
  }
}

export default connect()(App)
