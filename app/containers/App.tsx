import { siad, isRunning, initSiad } from 'api/siad'
import * as React from 'react'

export let launchedSiadInterally = false

export const setLaunchedSiaFlag = (b: boolean) => {
  launchedSiadInterally = b
}

window.addEventListener('beforeunload', async e => {
  if (launchedSiadInterally) {
    console.log('onclose initialized')
    await siad.daemonStop()
    console.log('done unload sia')
  }
})

export default class App extends React.Component {
  componentDidMount = async () => {
    console.log('mounted App')
    const running = await isRunning('localhost:9980')
    if (!running) {
      console.log('trying to launch on init...')
      setLaunchedSiaFlag(true)
      const tryLaunch = await initSiad()
      if (tryLaunch) {
        console.log('starting siad,')
        tryLaunch.stdout.on('data', (data: any) => {
          const log = data.toString()
          console.log('siad', log)
        })
      }
    }
  }
  render() {
    return <div>{this.props.children}</div>
  }
}
