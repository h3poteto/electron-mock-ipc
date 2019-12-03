import index from '../src/index'
import { ipcMain, ipcRenderer } from './mock'
import { IpcMainEvent } from 'electron'
import * as electron from 'electron'
import { describe, beforeEach, it } from 'mocha'
import { expect } from 'chai'
import sinon from 'sinon'

describe('index', () => {
  beforeEach(() => {
    sinon.stub(electron, 'ipcRenderer').returns(ipcRenderer)
  })
  it('should be return', async () => {
    ipcMain.once('test-event', (event: IpcMainEvent, _: any) => {
      event.sender.send('response-test-event', 'hoge')
    })
    const res = await index()
    expect(res).to.equal('hoge')
  })
})
