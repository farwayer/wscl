## wscl

[![NPM version](https://img.shields.io/npm/v/wscl.svg)](https://www.npmjs.com/package/wscl)

Simple WebSocket wrapper with some extra features:

- auto reconnect with exponential backoff strategy
- wait connection before sending messages

Lib is small. Its size [limited](https://github.com/ai/size-limit)
to **594 bytes** (with all deps, minified and brotlied).

## How to use

```shell
yarn add wscl
```

```js
import {Client, events} from 'wscl'

const wsc = new Client({
  url: 'wss://echo.websocket.org',
})

wsc.on(events.Open, console.log)
wsc.on(events.Close, console.log)
wsc.on(events.Message, console.log) // will be called with data not event
wsc.on(events.Error, console.log) // will be called with error not event

// you can send message before connect
wsc.send("message")

await wsc.connect()
console.log(wsc.connected)

wsc.close("reason")
```
