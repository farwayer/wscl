## wscl

[![NPM version](https://img.shields.io/npm/v/wscl.svg)](https://www.npmjs.com/package/wscl)

Simple WebSocket wrapper with some extra features:

- auto reconnect with exponential backoff strategy
- wait connection before sending messages

Lib is small. Its size [limited](https://github.com/ai/size-limit)
to **624 bytes** (with all deps, minified and brotlied).

## How to use

```bash
yarn add wscl
```

```js
import {WSClient, events} from 'wscl'

const wsc = new WSClient({
url: 'wss://echo.websocket.org',
})

wsc.on(events.Open, console.log)
wsc.on(events.Close, console.log)
wsc.on(events.Message, console.log)
wsc.on(events.Error, console.log)

// you can send message before connect
wsc.send("message")

await wsc.connect()
console.log(wsc.connected)

wsc.close("reason")

wsc.connect()
await wsc.ready
```
