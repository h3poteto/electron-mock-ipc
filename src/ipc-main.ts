import { Event, WebContents } from 'electron'
import Pipe from './pipe'

class Contents extends WebContents {
  private _pipe: Pipe

  constructor(pipe: Pipe) {
    super()
    this._pipe = pipe
  }

  send(channel: string, ...args: any) {
    this._pipe.sendFromMain(channel, ...args)
  }
}

class MainEvent implements Event {
  public returnValue: any
  public sender: WebContents

  constructor(pipe: Pipe) {
    this.sender = new Contents(pipe)
  }

  preventDefault(): void {
    return
  }
}

class ipcMain {
  private _event: MainEvent
  private _pipe: Pipe

  constructor(pipe: Pipe) {
    this._event = new MainEvent(pipe)
    this._pipe = pipe
  }

  on(ch: string, listener: (ev: Event, args: any) => void) {
    this._pipe.on('receive-main-event', (channel: string, obj: any) => {
      if (ch === channel) {
        listener(this._event, obj)
      }
    })
  }

  once(ch: string, listener: (ev: Event, args: any) => void) {
    this._pipe.once('receive-main-event', (channel: string, obj: any) => {
      if (ch === channel) {
        listener(this._event, obj)
      }
    })
  }

  send(ch: string, ...args: any) {
    this._pipe.sendFromMain(ch, ...args)
  }

  removeListener(ch: string, listener: (...args: any[]) => void) {
    this._pipe.removeListener(ch, listener)
  }

  removeAllListeners(ch?: string) {
    this._pipe.removeAllListeners(ch)
  }
}

export default ipcMain
