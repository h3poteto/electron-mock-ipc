import index from '../src/index'
import { ipcMain, ipcRenderer } from '../__mocks__/electron'
import { IpcMainEvent } from 'electron'
;(global as any).ipcRenderer = ipcRenderer

describe('index', () => {
  beforeEach(() => {
    ipcMain.once('test-event', (event: IpcMainEvent, _: any) => {
      event.sender.send('response-test-event', 'hoge')
    })
  })
  it('should be return', async () => {
    const res = await index()
    expect(res).toEqual('hoge')
  })
})
