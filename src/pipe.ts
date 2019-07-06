import { EventEmitter } from 'events'

export default class Pipe extends EventEmitter {
  sendFromMain(channel: string, ...args: any) {
    setTimeout(() => this.emit('receive-renderer-event', channel, ...args), 1)
  }

  sendFromRenderer(channel: string, ...args: any) {
    setTimeout(() => this.emit('receive-main-event', channel, ...args), 1)
  }
}
