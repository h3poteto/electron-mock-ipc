import { IpcRendererEvent, IpcMainEvent } from 'electron'
import createIPCMock, { ipcMain, ipcRenderer } from '@/index'
import { sleepMethod } from './helper'

describe('send event from renderer to main', () => {
  let ipcMain: ipcMain
  let ipcRenderer: ipcRenderer

  beforeEach(() => {
    const mocked = createIPCMock()
    ipcMain = mocked.ipcMain
    ipcRenderer = mocked.ipcRenderer
  })

  describe('send and once', () => {
    it('should be received in main', () => {
      const testMessage = 'test'
      ipcMain.once('test-event', (_ev: IpcMainEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })

      ipcRenderer.send('test-event', testMessage)
    })

    it('should be resent and received', () => {
      const testMessage = 'test'
      ipcRenderer.once('response-test-event', (_ev: IpcRendererEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })
      ipcMain.once('test-event', (ev: IpcMainEvent, obj: string) => {
        ev.sender.send('response-test-event', obj)
      })

      ipcRenderer.send('test-event', testMessage)
    })
  })

  describe('send and on', () => {
    afterEach(() => {
      ipcMain.removeAllListeners('test-event')
      ipcRenderer.removeAllListeners('response-test-event')
    })

    it('should be received in main', () => {
      const testMessage = 'test'
      ipcMain.on('test-event', (_ev: IpcMainEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })

      ipcRenderer.send('test-event', testMessage)
    })

    it('should be resent and received', () => {
      const testMessage = 'test'
      ipcRenderer.on('response-test-event', (_ev: IpcRendererEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })
      ipcMain.on('test-event', (ev: IpcMainEvent, obj: string) => {
        ev.sender.send('response-test-event', obj)
      })

      ipcRenderer.send('test-event', testMessage)
    })
  })

  describe('invoke', () => {
    afterEach(() => {
      ipcMain.removeHandler('test-event')
    })

    it('should handle events', async () => {
      ipcMain.handle('test-event', async (_event, args) => {
        const result = await sleepMethod(args)
        return result
      })
      const res = await ipcRenderer.invoke('test-event', 'hoge')
      expect(res).toEqual('hoge')
    })

    it('should handle once an event', async () => {
      ipcMain.handleOnce('test-event', async (_event, args) => {
        const result = await sleepMethod(args)
        return result
      })
      const res = await ipcRenderer.invoke('test-event', 'hoge')
      expect(res).toEqual('hoge')
    })
  })
})

describe('send event from main to renderer', () => {
  let ipcMain: ipcMain
  let ipcRenderer: ipcRenderer

  beforeEach(() => {
    const mocked = createIPCMock()
    ipcMain = mocked.ipcMain
    ipcRenderer = mocked.ipcRenderer
  })

  describe('send and once', () => {
    it('should be received in renderer', () => {
      const testMessage = 'test'
      ipcRenderer.once('test-event', (_ev: IpcRendererEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })

      ipcMain.send('test-event', testMessage)
    })

    it('should be resent and received', () => {
      const testMessage = 'test'
      ipcMain.once('response-test-event', (_ev: IpcMainEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })
      ipcRenderer.once('test-event', (ev: IpcRendererEvent, obj: string) => {
        ev.sender.send('response-test-event', obj)
      })

      ipcMain.send('test-event', testMessage)
    })
  })

  describe('send and on', () => {
    afterEach(() => {
      ipcMain.removeAllListeners('response-test-event')
      ipcRenderer.removeAllListeners('test-event')
    })
    it('should be received in renderer', () => {
      const testMessage = 'test'
      ipcRenderer.on('test-event', (_ev: IpcRendererEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })

      ipcMain.send('test-event', testMessage)
    })

    it('should be resent and received', () => {
      const testMessage = 'test'
      ipcMain.on('response-test-event', (_ev: IpcMainEvent, obj: string) => {
        expect(obj).toEqual(testMessage)
      })
      ipcRenderer.on('test-event', (ev: IpcRendererEvent, obj: string) => {
        ev.sender.send('response-test-event', obj)
      })

      ipcMain.send('test-event', testMessage)
    })
  })
})

describe('registered event handlers are returned from #eventNames', () => {
  let ipcMain: ipcMain
  let ipcRenderer: ipcRenderer

  beforeEach(() => {
    const mocked = createIPCMock()
    ipcMain = mocked.ipcMain
    ipcRenderer = mocked.ipcRenderer
  })

  it('ipcMain should return the events that were registered', () => {
    ipcMain.on('test-event', () => null)
    expect(ipcMain.eventNames()).toEqual(expect.arrayContaining(['test-event']))
  })

  it('ipcRenderer should return the events that were registered', () => {
    ipcRenderer.on('test-event', () => null)
    expect(ipcRenderer.eventNames()).toEqual(expect.arrayContaining(['test-event']))
  })
})
