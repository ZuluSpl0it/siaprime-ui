import spawnAsync from '@expo/spawn-async'
import { defaultConfig } from 'config'

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
