import ipcMain from './ipc-main'
import ipcRenderer from './ipc-renderer'

const pipe = (main: ipcMain, renderer: ipcRenderer) => {
  main.emitter.on('send-to-renderer', (channel: string, ...args: any) => {
    setTimeout(() => renderer.emitter.emit('receive-from-main', channel, ...args), 1)
  })
  main.emitter.on('error-to-renderer', (channel: string, err: any) => {
    setTimeout(() => renderer.emitter.emit('error-from-main', channel, err), 1)
  })
  renderer.emitter.on('send-to-main', (channel: string, ...args: any) => {
    setTimeout(() => main.emitter.emit('receive-from-renderer', channel, ...args), 1)
  })
}

type Mock = {
  ipcMain: ipcMain
  ipcRenderer: ipcRenderer
}

const createIPCMock = (): Mock => {
  const main = new ipcMain()
  const renderer = new ipcRenderer()
  pipe(main, renderer)
  const mock: Mock = {
    ipcMain: main,
    ipcRenderer: renderer
  }
  return mock
}

export { ipcMain, ipcRenderer, pipe }

export default createIPCMock
