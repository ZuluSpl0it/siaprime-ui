import defaultConfig from 'config'
const pty = require('electron').remote.require('node-pty-prebuilt-multiarch')

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
