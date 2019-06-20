import { defaultConfig } from 'config'
import { Client } from 'sia-typescript'
export interface SiadConfig {
  path: string
  datadir: string
  rpcaddr: string
  hostaddr: string
  detached: boolean
  address: string
}

export const siad = new Client({
  apiPort: 4280,
  hostPort: 4282,
  rpcPort: 4281,
  agent: 'SiaPrime-Agent',
  dataDirectory: defaultConfig.siad.datadir
})

export const initSiad = () => {
  console.log(defaultConfig.siad.path)
  const p = siad.launch(defaultConfig.siad.path)
  return p
}

export const launchSiad = () => {
  return new Promise((resolve, reject) => {
    try {
      const p = initSiad()
      p.stdout.on('data', data => {
        console.log(data.toString())
      })
      p.stderr.on('data', data => {
        console.log(data.toString())
      })
      const timeout = setTimeout(() => {
        clearInterval(pollLoaded)
        resolve(false)
      }, 20000)
      const pollLoaded = setInterval(() => {
        if (siad.isRunning()) {
          clearInterval(pollLoaded)
          clearInterval(timeout)
          resolve(p)
        }
      }, 2000)
    } catch (e) {
      reject(e)
    }
  })
}
