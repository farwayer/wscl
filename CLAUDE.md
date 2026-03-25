# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**wscl** — A minimal browser WebSocket client wrapper (~644 bytes) with auto-reconnect (exponential backoff) and message queuing (waits for connection before sending). Published as an ESM package on npm.

## Commands

- **Install deps:** `yarn`
- **Size check:** `yarn size-limit` (runs automatically on `prepack`)
- **Publish:** `yarn clean-publish`

There are no test or lint scripts configured.

## Architecture

Single-file library at `src/index.js` exporting `Client` class and `events` namespace. Uses ES private fields (`#field`) throughout. Events are emitted via `nanoevents`. TypeScript types are provided in `index.d.ts` (hand-written, not generated).

Key design points:
- `url` config accepts a string or an async function (for dynamic URL resolution)
- `connect()` accepts an optional `init` callback that receives the raw WebSocket before event handlers are attached
- `send()` awaits `this.#ready` (a Promise that resolves on open), enabling pre-connection message queuing
- Reconnect logic uses exponential backoff: `interval * rate^retryNo`, capped at `retryWaitMax`
- Normal close (code 1000) skips reconnection

## Size Budget

The library has a strict 644 byte size limit (minified + brotli, including deps). Any changes must stay within this budget — verify with `yarn size-limit`.

## Package Manager

Uses Yarn 4 (Berry) with `node-modules` linker. The Yarn binary is committed at `.yarn/releases/`.