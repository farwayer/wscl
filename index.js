import {createNanoEvents} from 'nanoevents'
import * as events from './events.js'


let CloseCodeNormal = 1000
let DefaultRetryBackoffInterval = 10
let DefaultRetryBackoffRate = 2
let DefaultRetryWaitMax = 10240 // 10 retries
let DefaultRetryMax = Number.MAX_SAFE_INTEGER


export {events}

export class Client {
  #connected = false
  #emitter = createNanoEvents()
  #cfg = {
    reconnect: true,
    retryBackoffInterval: DefaultRetryBackoffInterval,
    retryBackoffRate: DefaultRetryBackoffRate,
    retryWaitMax: DefaultRetryWaitMax,
    retryMax: DefaultRetryMax,
    WebSocket: globalThis?.WebSocket,
  }
  #ws
  #retryNo = 0
  #ready
  #readyResolve

  get connected() {
    return this.#connected
  }

  constructor(cfg) {
    Object.assign(this.#cfg, cfg)

    this.#cfg.url || "url required"()
    this.#cfg.WebSocket || "WebSocket API not found"()

    this.#readyInit()
  }

  connect = async () => {
    if (this.connected) {
      return this
    }

    this.#ws = new this.#cfg.WebSocket(this.#cfg.url, this.#cfg.protocols)
    this.#ws.addEventListener(events.Open, this.#open)
    this.#ws.addEventListener(events.Close, this.#reconnect)
    this.#ws.addEventListener(events.Message, this.#msg)
    this.#ws.addEventListener(events.Error, this.#error)

    await this.#ready
    return this
  }

  close(reason) {
    if (!this.#connected) {
      return
    }

    this.#ws.close(CloseCodeNormal, reason)
  }

  async send(msg) {
    await this.#ready
    this.#ws.send(msg)
  }

  on(event, cb) {
    return this.#emitter.on(event, cb)
  }


  #readyInit() {
    this.#ready = new Promise(resolve => this.#readyResolve = resolve)
  }

  #open = event => {
    this.#connected = true
    this.#retryNo = 0
    this.#emitter.emit(events.Open, event)
    this.#readyResolve()
  }

  #reconnect = event => {
    if (this.connected) {
      this.connected = false
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

  #msg = event => {
    this.#emitter.emit(events.Message, event.data)
  }

  #error = event => {
    this.#emitter.emit(events.Error, event)
  }
}
