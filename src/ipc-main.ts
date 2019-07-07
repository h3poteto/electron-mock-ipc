import MockedEvent from './event'
import { EventEmitter } from 'events'

class ipcMain {
  public emitter: EventEmitter
  private _event: MockedEvent

  constructor() {
    this.emitter = new EventEmitter
    this.emitter.on('receive-from-renderer', this._onReceiveFromRenderer.bind(this))
    this._event = new MockedEvent(this.emitter, 'send-to-renderer')
  }

  _onReceiveFromRenderer(channel: string, ...args: any) {
    this.emitter.emit(channel, this._event, ...args)
  }

  on(ch: string, listener: (ev: any, args: any) => void) {
    this.emitter.on(ch, listener)
  }

  once(ch: string, listener: (ev: any, args: any) => void) {
    this.emitter.once(ch, listener)
  }

  send(ch: string, ...args: any) {
    this.emitter.emit('send-to-renderer', ch, ...args)
  }

  removeListener(ch: string, listener: (...args: any[]) => void) {
    this.emitter.removeListener(ch, listener)
  }

  removeAllListeners(ch?: string) {
    this.emitter.removeAllListeners(ch)
  }
}

export default ipcMain
