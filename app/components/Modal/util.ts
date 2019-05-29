import defaultConfig from 'config'
import * as path from 'path'
const pty = require('electron').remote.require('node-pty-prebuilt-multiarch')

// find the dirname for siac instead of the direct binary path
const siacBasePath = path.dirname(defaultConfig.siac.path)

// use the bin name (usually siac), but can be set in the config.json file
const siacBinName = path.basename(defaultConfig.siac.path)

export const createShell = (command = '') => {
  let args = command.split(' ')
  if (args[0] === 'siac') {
    args = [...args.splice(1)]
  }
  var term = pty.spawn(siacBinName, args, {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    // use base path as cwd so arv0 is siac
    cwd: siacBasePath,
    env: process.env
  })
  return term
}
