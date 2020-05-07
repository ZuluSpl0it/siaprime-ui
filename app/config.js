const path = require('path')
const fs = require('fs')
const merge = require('lodash/merge')
const isEqual = require('lodash/isEqual')
const set = require('lodash/set')
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
const userConfigFolder = path.join(app.getPath('home'), '/Appdata/Local/ScPrime')
const userConfigPath = path.join(userConfigFolder, 'config.json')

console.log('PATH', userConfigFolder, userConfigPath)
// Default config
let defaultConfig = {
  darkMode: false,
  debugMode: false,
  developmentMode: !isProd,
  siad: {
    useCustomBinary: false,
    path: defaultSiadPath,
    datadir: path.join(app.getPath('home'), '/Appdata/Local/ScPrime')
  },
  siac: {
    useCustomBinary: false,
    path: defaultSiacPath
  },
  logPath: userConfigFolder,
  userConfigPath
}

//Try to move consensus metadata
    newcPath = path.join(app.getPath('home'), '/Appdata/Local/ScPrime/consensus')
    newcPathExists = fs.existsSync(newcPath)
    if (!newcPathExists) {
        currentcPath = path.join(app.getPath('userData'), './siaprime/consensus')
        currentcPathExists = fs.existsSync(currentcPath)
        if (currentcPathExists) {
            try {
                fs.renameSync(currentcPath, newcPath)
            } catch (err) {
                alert('Cant move consensus to new location')
              
           }
       }
   }
 //Try to move gateway metadata
    newgPath = path.join(app.getPath('home'), '/Appdata/Local/ScPrime/gateway')
    newgPathExists = fs.existsSync(newgPath)
    if (!newgPathExists) {
        currentgPath = path.join(app.getPath('userData'), './siaprime/gateway')
        currentgPathExists = fs.existsSync(currentgPath)
        if (currentgPathExists) {
            try {
                fs.renameSync(currentgPath, newgPath)
            } catch (err) {
                alert('Cant move gateway metadata to new location')
              
           }
       }
   }
   
   //Try to move host metadata
    newhPath = path.join(app.getPath('home'), '/Appdata/Local/ScPrime/host')
    newhPathExists = fs.existsSync(newhPath)
    if (!newhPathExists) {
        currenthPath = path.join(app.getPath('userData'), './siaprime/host')
        currenthPathExists = fs.existsSync(currenthPath)
        if (currenthPathExists) {
            try {
                fs.renameSync(currenthPath, newhPath)
            } catch (err) {
                alert('Cant move host metadata to new location')
              
           }
       }
   }
   
//Try to move renter metadata
 newrPath = path.join(app.getPath('home'), '/Appdata/Local/ScPrime/renter')
    newrPathExists = fs.existsSync(newrPath)
    if (!newrPathExists) {
        currentrPath = path.join(app.getPath('userData'), './siaprime/renter')
        currentrPathExists = fs.existsSync(currentrPath)
        if (currentrPathExists) {
            try {
                fs.renameSync(currentrPath, newrPath)
            } catch (err) {
                alert('Cant move renter metadata to new location')
              
           }
       }
   }
   //Try to move transactionpool metadata
    newtPath = path.join(app.getPath('home'), '/Appdata/Local/ScPrime/transactionpool')
    newtPathExists = fs.existsSync(newtPath)
    if (!newtPathExists) {
        currenttPath = path.join(app.getPath('userData'), './siaprime/transactionpool')
        currenttPathExists = fs.existsSync(currenttPath)
        if (currenttPathExists) {
            try {
                fs.renameSync(currenttPath, newtPath)
            } catch (err) {
                alert('Cant move transactionpool metadata to new location')
              
           }
       }
   }

 //Try to move wallet metadata
  newwPath = path.join(app.getPath('home'), '/Appdata/Local/ScPrime/wallet')
    newwPathExists = fs.existsSync(newwPath)
    if (!newwPathExists) {
        currentwPath = path.join(app.getPath('userData'), './siaprime/wallet')
        currentwPathExists = fs.existsSync(currentwPath)
        if (currentwPathExists) {
            try {
                fs.renameSync(currentwPath, newwPath)
            } catch (err) {
                alert('Cant move wallet metadata to new location')
              
           }
       }
   }



let userConfig
try {
  const userConfigBuffer = fs.readFileSync(userConfigPath)
  userConfig = JSON.parse(userConfigBuffer.toString())
  defaultConfig = merge(defaultConfig, userConfig)
  // check useCustomBinary flags
  if (!defaultConfig.siad.useCustomBinary) {
    set(defaultConfig, 'siad.path', defaultSiadPath)
  }
  if (!defaultConfig.siac.useCustomBinary) {
    set(defaultConfig, 'siac.path', defaultSiacPath)
  }
} catch (err) {
  console.error('error reading user config file:', err)
}

try {
  if (!isEqual(userConfig, defaultConfig)) {
    fs.writeFileSync(userConfigPath, JSON.stringify(defaultConfig, null, 4))
  }
} catch (err) {
  console.error('error saving user config file:', err)
}

module.exports = defaultConfig

