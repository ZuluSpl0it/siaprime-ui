import { defaultConfig } from 'config'
import * as S from 'sia.js'
import { Client } from 'siajs-lib'
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

// TODO: need to replace with siajs-lib instead of using sia.js
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
