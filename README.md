## wscl

[![NPM version](https://img.shields.io/npm/v/wscl.svg)](https://www.npmjs.com/package/wscl)

Simple browser WebSocket wrapper with some extra features:

- auto reconnect with x2 time strategy
- wait connection before sending message

Lib is tiny. Its size [limited](https://github.com/ai/size-limit)
to **627 bytes** (with all deps, minified and gzipped).

## How to use

```bash
yarn add wscl
```

```js
import {WSClient, WSEvents} from 'wscl'

async function test() {
  const ws = new WSClient({
    url: 'wss://echo.websocket.org',
    reconnect: true,
    reconnectWaitMin: 125,
    reconnectWaitMax: 8000,
  })
  
  ws.on(WSEvents.Open, console.log)
  ws.on(WSEvents.Close, console.log)
  ws.on(WSEvents.Message, console.log)
  ws.on(WSEvents.Error, console.log)

  // you can send message before connect
  ws.send("message")

  await ws.connect()
  console.log(ws.connected)
  
  ws.close("reason")
  
  ws.connect()
  await ws.ready
}
```

## IE and old browsers

If you support IE and old browsers, you need to
[transpile](https://developer.epages.com/blog/coding/how-to-transpile-node-modules-with-babel-and-webpack-in-a-monorepo/)
`wscl` and `nanoevents` from node_modules.
