## Changelog

### 2.2.0

- ws init can be async
- fix init was not called after reconnection

### 2.1.3

- event as error handler argument
- typing: on()


### 2.1.2

- typing: url getter can be async

### 2.1.1

- typing: connect init argument is optional

### 2.1.0

- url can be function

### 2.0.12

- can close connection even in connecting state

### 2.0.0

- module only
- do not transpile
- use exponential backoff retry strategy (see new retry config options)
- typings
- WSEvents -> events, WSClient -> Client

### 1.2.2

- fix WebSocket undefined on nodejs

### 1.2.1

- fix build issue

### 1.2.0

- add ability to use custom WebSocket (ws for nodejs for example)

### 1.1.2

- fix exports field

### 1.1.1

- up deps

### 1.1.0

- reduce lib size
- export WSClient
