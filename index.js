import {createNanoEvents} from 'nanoevents'


export const WSEvents = {
  Open: 'open',
  Close: 'close',
  Message: 'message',
  Error: 'error',
}

const CloseCodeNormal = 1000
const DefaultReconnectWait = {
  Min: 125,
  Max: 8000,
}

export class WSClient {
  connected = false

  _emitter = createNanoEvents()
  _cfg = {
    url: undefined,
    protocols: undefined,
    reconnect: true,
    reconnectWaitMin: DefaultReconnectWait.Min,
    reconnectWaitMax: DefaultReconnectWait.Max,
    WebSocket: WebSocket,
  }

  constructor(cfg) {
    Object.assign(this._cfg, cfg)

    if (!this._cfg.url) {
      throw new Error("url required")
    }

    this._readyInit()
    this._reconnectWait = this._cfg.reconnectWaitMin
  }

  connect = () => {
    if (this.connected) return

    this._ws = new this._cfg.WebSocket(this._cfg.url, this._cfg.protocols)
    this._ws.addEventListener(WSEvents.Open, this._open)
    this._ws.addEventListener(WSEvents.Close, this._reconnect)
    this._ws.addEventListener(WSEvents.Message, this._msg)
    this._ws.addEventListener(WSEvents.Error, this._error)

    return this.ready
  }

  close(reason) {
    if (!this.connected) return
    this._ws.close(CloseCodeNormal, reason)
  }

  send(msg) {
    this.ready.then(() => {
      this._ws.send(msg)
    })
  }

  on(event, cb) {
    this._emitter.on(event, cb)
  }


  _readyInit = () => {
    this.ready = new Promise(resolve => this._readyResolve = resolve)
  }

  _msg = event => {
    this._emitter.emit(WSEvents.Message, event.data)
  }

  _open = event => {
    this.connected = true
    this._reconnectWait = this._cfg.reconnectWaitMin
    this._emitter.emit(WSEvents.Open, event)
    this._readyResolve()
  }

  _reconnect = event => {
    if (this.connected) {
      this.connected = false
      this._readyInit()
      this._emitter.emit(WSEvents.Close, event)
    }

    if (event.code === CloseCodeNormal) return
    if (!this._cfg.reconnect) return

    setTimeout(this.connect, this._reconnectWait)
    if ((this._reconnectWait *= 2) > this._cfg.reconnectWaitMax) {
      this._reconnectWait = this._cfg.reconnectWaitMax
    }
  }

  _error = event => {
    this._emitter.emit(WSEvents.Error, event)
  }
}

export default WSClient
