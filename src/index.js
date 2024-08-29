import {createNanoEvents} from 'nanoevents'
import * as events from './events.js'


let CloseCodeNormal = 1000

export {events}

export class Client {
  #cfg = {
    reconnect: true,
    retryBackoffInterval: 10,
    retryBackoffRate: 2,
    retryWaitMax: 10240, // for 10 retry with default backoff config
    retryMax: 2**53 - 1,
    WebSocket: globalThis?.WebSocket,
  }
  #emitter = createNanoEvents()
  #ws
  #connected = false
  #retryNo = 0
  #ready
  #readyResolve

  get connected() {
    return this.#connected
  }

  get ready() {
    return this.#ready
  }

  constructor(cfg) {
    Object.assign(this.#cfg, cfg)

    this.#cfg.url || "url required"()
    this.#cfg.WebSocket || "WebSocket API not found"()

    this.#readyInit()
  }

  connect = async (init) => {
    if (this.#connected) {
      return this
    }

    let url = await getUrl(this.#cfg.url)

    this.#ws = new this.#cfg.WebSocket(url, this.#cfg.protocols)
    init?.(this.#ws)

    this.#ws.onopen = this.#open
    this.#ws.onclose = this.#close
    this.#ws.onmessage = this.#msg
    this.#ws.onerror = this.#error

    return this.#ready
  }

  close(reason) {
    this.#ws?.close(CloseCodeNormal, reason)
  }

  async send(msg) {
    await this.#ready
    this.#ws.send(msg)
  }

  on(event, cb) {
    return this.#emitter.on(event, cb)
  }

  #open = event => {
    this.#connected = true
    this.#retryNo = 0
    this.#emitter.emit(events.Open, event)
    this.#readyResolve(this)
  }

  #close = event => {
    if (this.connected) {
      this.#connected = false
      this.#readyInit()
      this.#emitter.emit(events.Close, event)
    }

    if (event.code === CloseCodeNormal) {
      return
    }

    if (!this.#cfg.reconnect) {
      return
    }

    if (this.#retryNo >= this.#cfg.retryMax) {
      return
    }

    let wait = this.#retryWait()
    setTimeout(this.connect, wait)
  }

  #retryWait() {
    let {retryBackoffInterval, retryBackoffRate, retryWaitMax} = this.#cfg

    let wait = retryBackoffInterval * retryBackoffRate ** this.#retryNo++
    return Math.min(wait, retryWaitMax)
  }

  #readyInit() {
    this.#ready = new Promise(resolve => this.#readyResolve = resolve)
  }

  #msg = event =>
    this.#emitter.emit(events.Message, event.data)

  #error = event =>
    this.#emitter.emit(events.Error, event)
}

let getUrl = async url =>
  typeof url === 'function' ? url() : url
