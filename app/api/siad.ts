import { defaultConfig } from 'config'
import * as S from '@eddiewang/sia.js'
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
  dataDirectory: defaultConfig.siad.datadir
})

// TODO: need to replace with sia-typescript instead of using sia.js
export const initSiad = async () => {
  console.log('launching at ', defaultConfig.siad.path)
  const p = S.launch(defaultConfig.siad.path, {
    'sia-directory': defaultConfig.siad.datadir,
    modules: 'cghrtw'
  })
  return p
}

export const isRunning = S.isRunning

export const siadConnectionString = siad.getConnectionUrl()
