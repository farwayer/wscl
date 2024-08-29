import {Unsubscribe} from 'nanoevents'


declare namespace events {
  export const Open: 'open'
  export const Close: 'close'
  export const Message: 'message'
  export const Error: 'error'
}

export type Config = {
  url: string | URL | (() => Promise<string>)
  protocols?: string | string[]
  reconnect?: boolean
  retryBackoffInterval?: number
  retryBackoffRate?: number
  retryWaitMax?: number
  retryMax?: number
  WebSocket?: WebSocket
}

type OpenCb = (e: Event) => void
type CloseCb = (e: CloseEvent) => void
type MessageCb<T> = (data: T) => void
type ErrorCb = (e: Event) => void

export class Client<MSG> {
  constructor(cfg: Config)

  readonly connected: boolean
  readonly ready: Promise<this>

  connect(init?: (ws: WebSocket) => void): Promise<this>
  close(reason?: string): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): Promise<void>
  on(event: typeof events.Open, cb: OpenCb): Unsubscribe
  on(event: typeof events.Close, cb: CloseCb): Unsubscribe
  on(event: typeof events.Message, cb: MessageCb<MSG>): Unsubscribe
  on(event: typeof events.Error, cb: ErrorCb): Unsubscribe
}
