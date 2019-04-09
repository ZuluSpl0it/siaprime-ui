import * as path from 'path'
import * as fs from 'fs'
import { merge } from 'lodash'
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
  `${process.platform === 'win32' ? 'siad.exe' : 'siad'}`
)

const defaultSiacPath = path.join(
  daemonPath,
  `${process.platform === 'win32' ? 'siac.exe' : 'siac'}`
)

// User config path
const userConfigPath = path.join(app.getPath('userData'), 'sia', 'config.json')
// Default config
let defaultConfig = {
  siad: {
    path: defaultSiadPath,
    datadir: path.join(app.getPath('userData'), './sia')
  },
  siac: {
    path: defaultSiacPath
  }
}
try {
  const userConfigBuffer = fs.readFileSync(userConfigPath)
  const userConfig = JSON.parse(userConfigBuffer.toString())
  defaultConfig = merge(defaultConfig, userConfig)
} catch (err) {
  console.error('error reading user config file:', err)
}

export { defaultConfig }
