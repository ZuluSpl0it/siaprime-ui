const path = require('path')
const fs = require('fs')
const merge = require('lodash/merge')
const electron = require('electron')
const appRootDir = require('app-root-dir')
const getPlatform = require('./get-platform')

const app = electron.app || electron.remote.app

const isProd = process.env.NODE_ENV === 'production'

const daemonPath = isProd
  ? path.join(process.resourcesPath, 'bin')
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

// User config path
const userConfigFolder = path.join(app.getPath('userData'), 'siaprime')
const userConfigPath = path.join(userConfigFolder, 'config.json')
// Default config
let defaultConfig = {
  debugMode: false,
  developmentMode: !isProd,
  siad: {
    path: defaultSiadPath,
    datadir: path.join(app.getPath('userData'), './siaprime')
  },
  siac: {
    path: defaultSiacPath
  },
  userConfigFolder
}

try {
  const userConfigBuffer = fs.readFileSync(userConfigPath)
  const userConfig = JSON.parse(userConfigBuffer.toString())
  defaultConfig = merge(defaultConfig, userConfig)
} catch (err) {
  console.error('error reading user config file:', err)
}

module.exports = defaultConfig
