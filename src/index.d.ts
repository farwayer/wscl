import {Unsubscribe} from 'nanoevents'


export enum events {
  Open = 'open',
  Close = 'close',
  Message = 'message',
  Error = 'error',
}

export type ClientCfg = {
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
  constructor(cfg: ClientCfg)

  readonly connected: boolean

  connect(init: (ws: WebSocket) => void): Promise<this>
  close(reason?: string): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): Promise<void>
  on(event: events): Unsubscribe
}
