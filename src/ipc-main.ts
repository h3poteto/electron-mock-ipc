import MockedEvent from './event'
import { EventEmitter } from 'events'
import { IpcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { internalPrefix } from './utils'

class ipcMain implements IpcMain {
  public emitter: EventEmitter
  private _event: MockedEvent

  constructor() {
    this.emitter = new EventEmitter()
    this.emitter.on('receive-from-renderer', this._onReceiveFromRenderer.bind(this))
    this._event = new MockedEvent(this.emitter, 'send-to-renderer')
  }

  _onReceiveFromRenderer(channel: string, ...args: any) {
    this.emitter.emit(channel, this._event, ...args)
  }

  on(channel: string, listener: (event: IpcMainEvent, ...args: any[]) => void): any {
    this.emitter.on(channel, listener)
  }

  once(channel: string, listener: (event: IpcMainEvent, ...args: any[]) => void): any {
    this.emitter.once(channel, listener)
  }

  send(channel: string, ...args: any): void {
    this.emitter.emit('send-to-renderer', channel, ...args)
  }

  removeListener(channel: string, listener: (...args: any[]) => void): any {
    this.emitter.removeListener(channel, listener)
  }

  removeAllListeners(channel: string): any {
    this.emitter.removeAllListeners(channel)
  }

  handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any): void {
    const safeChannel = internalPrefix(channel)
    this.emitter.on(safeChannel, async (event: IpcMainEvent, ...args: any[]) => {
      try {
        const res = await listener(event, ...args)
        this.emitter.emit('send-to-renderer', safeChannel, res)
      } catch (err) {
        this.emitter.emit('error-to-renderer', safeChannel, err)
      }
    })
  }

  handleOnce(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any): void {
    const safeChannel = internalPrefix(channel)
    this.emitter.once(safeChannel, async (event: IpcMainEvent, ...args: any[]) => {
      try {
        const res = await listener(event, ...args)
        this.emitter.emit('send-to-renderer', safeChannel, res)
      } catch (err) {
        this.emitter.emit('error-to-renderer', safeChannel, err)
      }
    })
  }

  removeHandler(channel: string): void {
    this.emitter.removeAllListeners(channel)
  }

  /**
   * Unused methods for mock.
   * These methods are defined in node.
   */
  addListener(_event: string | symbol, _listener: (...args: any[]) => void): any {}
  off(_event: string | symbol, _listener: (...args: any[]) => void): any {}
  setMaxListeners(_n: number): any {}

  getMaxListeners(): number {
    return 1
  }

  listeners(_event: string | symbol): Function[] {
    const undef = () => {
      console.log('undefined')
    }
    return [undef]
  }

  rawListeners(_event: string | symbol): Function[] {
    const undef = () => {
      console.log('undefined')
    }
    return [undef]
  }

  emit(_event: string | symbol, ..._args: any[]): boolean {
    return true
  }

  listenerCount(_type: string | symbol): number {
    return 1
  }

  prependListener(_event: string | symbol, _listener: (...args: any[]) => void): any {}
  prependOnceListener(_event: string | symbol, _listener: (...args: any[]) => void): any {}

  eventNames(): Array<string | symbol> {
    return this.emitter.eventNames()
  }
}

export default ipcMain
