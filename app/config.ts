import * as path from 'path'
const { app } = require('electron').remote
const appRootDir = require('app-root-dir')
const getPlatform = require('./get-platform')

const isProd = process.env.NODE_ENV === 'production'

const daemonPath = isProd
  ? path.join(process.resourcesPath as any, 'bin')
  : path.join(appRootDir.get(), 'bin', getPlatform())

// Setup the default path for Siad
const defaultSiadPath = path.join(
  daemonPath,
  `${process.platform === 'win32' ? 'spd.exe' : 'spd'}`
)

const defaultSiacPath = path.join(
  daemonPath,
  `${process.platform === 'win32' ? 'spc.exe' : 'spc'}`
)
// Default config
export const defaultConfig = {
  siad: {
    path: defaultSiadPath,
    datadir: path.join(app.getPath('userData'), './siaprime')
  },
  siac: {
    path: defaultSiacPath
  }
}
