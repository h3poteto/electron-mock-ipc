import { IpcRendererEvent, IpcMainEvent } from 'electron'
import createIPCMock, { ipcMain, ipcRenderer } from '@/index'

describe('send from main', () => {
  let ipcMain: ipcMain
  let ipcRenderer: ipcRenderer

  beforeEach(() => {
    const mocked = createIPCMock()
    ipcMain = mocked.ipcMain
    ipcRenderer = mocked.ipcRenderer
  })

  it('should be received', () => {
    const testMessage = 'test'
    ipcMain.once('test-event', (ev: IpcMainEvent, obj: string) => {
      expect(obj).toEqual(testMessage)
    })

    ipcRenderer.send('test-event', testMessage)
  })

  it('should be resend and receive', () => {
    const testMessage = 'test'
    ipcRenderer.once('response-test-event', (ev: IpcRendererEvent, obj: string) => {
      expect(obj).toEqual(testMessage)
    })
    ipcMain.once('test-event', (ev: IpcMainEvent, obj: string) => {
      ev.sender.send('response-test-event', obj)
    })

    ipcRenderer.send('test-event', testMessage)
  })
})

describe('send from renderer', () => {
  let ipcMain: ipcMain
  let ipcRenderer: ipcRenderer

  beforeEach(() => {
    const mocked = createIPCMock()
    ipcMain = mocked.ipcMain
    ipcRenderer = mocked.ipcRenderer
  })

  it('should be received', () => {
    const testMessage = 'test'
    ipcRenderer.once('test-event', (ev: IpcRendererEvent, obj: string) => {
      expect(obj).toEqual(testMessage)
    })

    ipcMain.send('test-event', testMessage)
  })

  it('should be resend and receive', () => {
    const testMessage = 'test'
    ipcMain.once('response-test-event', (ev: IpcMainEvent, obj: string) => {
      expect(obj).toEqual(testMessage)
    })
    ipcRenderer.once('test-event', (ev: IpcRendererEvent, obj: string) => {
      ev.sender.send('response-test-event', obj)
    })

    ipcMain.send('test-event', testMessage)
  })
})
