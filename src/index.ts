import Pipe from './pipe'
import ipcMain from './ipc-main'
import ipcRenderer from './ipc-renderer'

type Mock = {
  ipcMain: ipcMain
  ipcRenderer: ipcRenderer
}

const createIPCMock = (): Mock => {
  const pipe = new Pipe()
  const main = new ipcMain(pipe)
  const renderer = new ipcRenderer(pipe)
  const mock: Mock = {
    ipcMain: main,
    ipcRenderer: renderer
  }
  return mock
}

export {
  ipcMain,
  ipcRenderer
}

export default createIPCMock
