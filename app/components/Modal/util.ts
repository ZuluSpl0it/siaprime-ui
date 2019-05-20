import spawnAsync from '@expo/spawn-async'
import defaultConfig from 'config'
const pty = require('electron').remote.require('node-pty-prebuilt-multiarch')
const os = require('os')

export const spawnSiac = async (command: any) => {
  try {
    let args = command.split(' ')
    if (args[0] === 'siac') {
      args = [...args.splice(1)]
    }

    const siac = spawnAsync(defaultConfig.siac.path, args, {
      argv0: 'siac'
    })
    let { pid, stdout, stderr, status, signal } = await siac

    return stdout
  } catch (e) {
    if (e.stderr) {
      return e.stderr
    } else {
      throw new Error(e)
    }
  }
}

const siacPath = defaultConfig.siac.path

export const createShell = (command = '') => {
  let args = command.split(' ')
  if (args[0] === 'siac') {
    args = [...args.splice(1)]
  }
  var term = pty.spawn(siacPath, args, {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  })
  return term
}
