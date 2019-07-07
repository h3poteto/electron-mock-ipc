import ipcMain from './ipc-main'
import ipcRenderer from './ipc-renderer'

const pipe = (main: ipcMain, renderer: ipcRenderer) => {
  main.emitter.on('send-to-renderer', (channel: string, ...args: any) => {
    setTimeout(() => renderer.emitter.emit('receive-from-main', channel, ...args), 1)
  })
  renderer.emitter.on('send-to-main', (channel: string, ...args: any) => {
    setTimeout(() => main.emitter.emit('receive-from-renderer', channel, ...args), 1)
  })
}

export default pipe
