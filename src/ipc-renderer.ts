import { Event, WebContents } from 'electron'
import Pipe from './pipe'

class Contents extends WebContents {
  private _pipe: Pipe

  constructor(pipe: Pipe) {
    super()
    this._pipe = pipe
  }

  send(channel: string, ...args: any) {
    this._pipe.sendFromRenderer(channel, ...args)
  }
}

class RendererEvent implements Event {
  public sender: WebContents
  // Event interface
  readonly bubbles: boolean
  public cancelBubble: boolean
  readonly cancelable: boolean
  readonly composed: boolean
  readonly currentTarget: EventTarget | null
  readonly defaultPrevented: boolean
  readonly eventPhase: number
  readonly isTrusted: boolean
  public returnValue: any
  readonly srcElement: EventTarget | null
  readonly target: EventTarget | null
  readonly timeStamp: number
  readonly type: string
  readonly AT_TARGET: number;
  readonly BUBBLING_PHASE: number;
  readonly CAPTURING_PHASE: number;
  readonly NONE: number;

  constructor(pipe: Pipe) {
    this.sender = new Contents(pipe)
    // Event interface
    this.bubbles = false
    this.cancelBubble = false
    this.cancelable = false
    this.composed = false
    this.currentTarget = null
    this.defaultPrevented = false
    this.eventPhase = 0
    this.isTrusted = true
    this.srcElement = null
    this.target = null
    this.timeStamp = 0
    this.type = 'click'
    this.AT_TARGET = 0
    this.BUBBLING_PHASE = 0
    this.CAPTURING_PHASE = 0
    this.NONE = 0
  }

  preventDefault(): void {
    return
  }

  composedPath(): EventTarget[] {
    return []
  }

  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    return
  }

  stopImmediatePropagation(): void {
    return
  }

  stopPropagation(): void {
    return
  }
}

class ipcRenderer {
  private _event: RendererEvent
  private _pipe: Pipe

  constructor(pipe: Pipe) {
    this._event = new RendererEvent(pipe)
    this._pipe = pipe
  }

  on(ch: string, listener: (ev: Event, args: any) => void) {
    this._pipe.on('receive-renderer-event', (channel: string, obj: any) => {
      if (ch === channel) {
        listener(this._event, obj)
      }
    })
  }

  once(ch: string, listener: (ev: Event, args: any) => void) {
    this._pipe.once('receive-renderer-event', (channel: string, obj: any) => {
      if (ch === channel) {
        listener(this._event, obj)
      }
    })
  }

  send(ch: string, ...args: any) {
    this._pipe.sendFromRenderer(ch, ...args)
  }

  removeListener(ch: string, listener: (...args: any[]) => void) {
    this._pipe.removeListener(ch, listener)
  }

  removeAllListeners(ch?: string) {
    this._pipe.removeAllListeners(ch)
  }
}

export default ipcRenderer
