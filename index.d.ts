import {Unsubscribe} from 'nanoevents'


declare namespace events {
  export const Open: 'open'
  export const Close: 'close'
  export const Message: 'message'
  export const Error: 'error'
}

export type Config = {
  url: string | URL
  protocols?: string | string[]
  reconnect?: boolean
  retryBackoffInterval?: number
  retryBackoffRate?: number
  retryWaitMax?: number
  retryMax?: number
  WebSocket?: WebSocket
}

export class Client {
  constructor(cfg: Config)

  readonly connected: boolean
  readonly ready: Promise<this>

  connect(init: (ws: WebSocket) => void): Promise<this>
  close(reason?: string): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): Promise<void>
  on(event: typeof events): Unsubscribe
}
