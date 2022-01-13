import { EventEmitter } from 'events'

class MockedEvent {
  public sender: Contents

  constructor(emitter: EventEmitter, target: string) {
    this.sender = new Contents(emitter, target)
  }
}

class Contents {
  private _emitter: EventEmitter
  private _target: string

  constructor(emitter: EventEmitter, target: string) {
    this._emitter = emitter
    this._target = target
  }

  send(channel: string, ...args: any) {
    this._emitter.emit(this._target, channel, ...args)
  }
}

export default MockedEvent
