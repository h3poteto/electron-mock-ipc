import index from '../src/index'
import { ipcMain } from '../__mocks__/electron'
import { IpcMainEvent } from 'electron'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('index', () => {
  it('should be return', async () => {
    ipcMain.once('test-event', (event: IpcMainEvent, _: any) => {
      event.sender.send('response-test-event', 'hoge')
    })
    const res = await index()
    expect(res).to.equal('hoge')
  })
})
