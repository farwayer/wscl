import {Unsubscribe} from 'nanoevents'


export enum events {
  Open = 'open',
  Close = 'close',
  Message = 'message',
  Error = 'error',
}

export type WSClientCfg = {
  url: string | URL
  protocols?: string | string[]
  reconnect?: boolean
  retryBackoffInterval?: number
  retryBackoffRate?: number
  retryWaitMax?: number
  retryMax?: number
  WebSocket?: WebSocket
}

export interface WSocket {
  new(cfg: WSClientCfg)

  readonly connected: boolean
  readonly ready: Promise<void>

  connect(): Promise<this>
  close(reason?: string): void
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): Promise<void>
  on(event: events): Unsubscribe
}
