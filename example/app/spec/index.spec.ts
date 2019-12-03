import index from '../src/index'
import { ipcMain } from './mock'
import { IpcMainEvent } from 'electron'

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
