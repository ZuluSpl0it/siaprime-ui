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
  dataDirectory: defaultConfig.siad.datadir,
})

export const initSiad = () => {
  console.log('SIAD_CONFIG', defaultConfig)
  console.log('SIAD', siad)
  const p = siad.launch(defaultConfig.siad.path)
  return p
}

export const launchSiad = () => {
  return new Promise((resolve, reject) => {
    try {
      const p = initSiad()
      // @ts-ignore
      p.stdout.on('data', data => {
        console.log(data.toString())
      })
      // @ts-ignore
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
