import MockedEvent from './event'
import { EventEmitter } from 'events'
import { IpcRenderer, IpcRendererEvent } from 'electron'
import { internalPrefix } from './utils'

class ipcRenderer implements IpcRenderer {
  public emitter: EventEmitter
  public errorEmitter: EventEmitter
  private _event: MockedEvent

  constructor() {
    this.emitter = new EventEmitter()
    this.errorEmitter = new EventEmitter()
    this.emitter.on('receive-from-main', this._onReceiveFromMain.bind(this))
    this.emitter.on('error-from-main', this._onErrorFromMain.bind(this))
    this._event = new MockedEvent(this.emitter, 'send-to-main')
  }

  _onReceiveFromMain(channel: string, ...args: any) {
    this.emitter.emit(channel, this._event, ...args)
  }

  _onErrorFromMain(channel: string, err: any) {
    this.errorEmitter.emit(channel, this._event, err)
  }

  on(channel: string, listener: (ev: IpcRendererEvent, ...args: any[]) => void): any {
    this.emitter.on(channel, listener)
  }

  once(channel: string, listener: (ev: IpcRendererEvent, ...args: any) => void): any {
    this.emitter.once(channel, listener)
  }

  send(channel: string, ...args: any[]): void {
    this.emitter.emit('send-to-main', channel, ...args)
  }

  removeListener(channel: string, listener: (...args: any[]) => void): any {
    this.emitter.removeListener(channel, listener)
  }

  removeAllListeners(channel: string): any {
    this.emitter.removeAllListeners(channel)
  }

  invoke(channel: string, ...args: any[]): Promise<any> {
    const safeChannel = internalPrefix(channel)
    return new Promise((resolve, reject) => {
      const resolveFn = (_ev: IpcRendererEvent, ...args: any[]) => {
        this.errorEmitter.removeListener(safeChannel, rejectFn)
        resolve([...args])
      }
      const rejectFn = (_ev: IpcRendererEvent, err: any) => {
        this.emitter.removeListener(safeChannel, resolveFn)
        reject(err)
      }

      this.emitter.once(safeChannel, resolveFn)
      this.errorEmitter.once(safeChannel, rejectFn)
      this.emitter.emit('send-to-main', safeChannel, ...args)
    })
  }

  /**
   * TODO: Implement these methods.
   * These methods are defined in electron.
   */
  sendSync(_channel: string, ...args: any[]): any {
    console.log(args)
  }

  sendTo(_webContentsId: number, _channel: string, ...args: any[]): void {
    console.log(args)
  }

  sendToHost(_channel: string, ...args: any[]): void {
    console.log(args)
  }

  postMessage(_channel: string, message: any, _transfer?: MessagePort[]): void {
    console.log(message)
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

export default ipcRenderer
