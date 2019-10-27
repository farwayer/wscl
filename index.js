import NanoEvents from 'nanoevents'


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

export default class WSClient extends NanoEvents {
  #ws
  #ready
  #readyResolve
  #connected = false
  #cfg = {
    url: undefined,
    protocols: undefined,
    reconnect: true,
    reconnectWaitMin: DefaultReconnectWait.Min,
    reconnectWaitMax: DefaultReconnectWait.Max,
  }
  #reconnectWait

  constructor(cfg) {
    super()
    Object.assign(this.#cfg, cfg)

    if (!this.#cfg.url) {
      throw new Error("url required")
    }

    this.#readyInit()
    this.#reconnectWait = this.#cfg.reconnectWaitMin
  }

  get connected() {
    return this.#connected
  }

  get ready() {
    return this.#ready
  }

  connect = () => {
    if (this.#connected) return

    this.#ws = new WebSocket(this.#cfg.url, this.#cfg.protocols)
    this.#ws.addEventListener(WSEvents.Open, this.#open)
    this.#ws.addEventListener(WSEvents.Close, this.#reconnect)
    this.#ws.addEventListener(WSEvents.Message, this.#msg)
    this.#ws.addEventListener(WSEvents.Error, this.#error)

    return this.#ready
  }

  close(reason) {
    if (!this.#connected) return
    this.#ws.close(CloseCodeNormal, reason)
  }

  async send(msg) {
    await this.#ready
    this.#ws.send(msg)
  }


  #readyInit = () => {
    this.#ready = new Promise(resolve => this.#readyResolve = resolve)
  }

  #msg = event => {
    this.emit(WSEvents.Message, event.data)
  }

  #open = event => {
    this.#connected = true
    this.#reconnectWait = this.#cfg.reconnectWaitMin
    this.emit(WSEvents.Open, event)
    this.#readyResolve()
  }

  #reconnect = event => {
    if (this.#connected) {
      this.#connected = false
      this.#readyInit()
      this.emit(WSEvents.Close, event)
    }

    if (event.code === CloseCodeNormal) return
    if (!this.#cfg.reconnect) return

    setTimeout(this.connect, this.#reconnectWait)
    if ((this.#reconnectWait *= 2) > this.#cfg.reconnectWaitMax) {
      this.#reconnectWait = this.#cfg.reconnectWaitMax
    }
  }

  #error = event => {
    this.emit(WSEvents.Error, event)
  }
}
