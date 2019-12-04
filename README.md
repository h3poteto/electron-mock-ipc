# ElectronMockIPC
[![Build Status](https://travis-ci.com/h3poteto/electron-mock-ipc.svg?branch=master)](https://travis-ci.com/h3poteto/electron-mock-ipc)
[![npm](https://img.shields.io/npm/v/electron-mock-ipc.svg)](https://www.npmjs.com/package/electron-mock-ipc)
[![GitHub release](https://img.shields.io/github/release/h3poteto/electron-mock-ipc.svg)](https://github.com/h3poteto/electron-mock-ipc/releases)
[![npm](https://img.shields.io/npm/dm/electron-mock-ipc)](https://www.npmjs.com/package/electron-mock-ipc)
[![NPM](https://img.shields.io/npm/l/electron-mock-ipc)](/LICENSE.txt)

This is a mock library for ipcMain and ipcRenderer in Electron. There are communicate each other, so you can mock ipc methods for your tests without changing your production code.


## Install

```
$ npm install --save-dev electron-mock-ipc
```

or

```
$ yarn add --dev electron-mock-ipc
```

## Usage
This library can use in jest, and mocha.

At first, please create a file to mock:

```typescript
import createIPCMock from 'electron-mock-ipc'

const mocked = createIPCMock()
const ipcMain = mocked.ipcMain
const ipcRenderer = mocked.ipcRenderer
export { ipcMain, ipcRenderer }
```
and save it as `spec/mock/electron-mock.ts`.


I assume you are using a preload script for nodeIntegration, like this:

```typescript
app.on('ready', () => {
  // Create the browser window.
  win = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        nodeIntegration: false,
        enableRemoteModule: false
      }
  })
})
```

And `ipcRenderer` object assign to window(global) in `preload.js`.

```javascript
import { ipcRenderer } from 'electron'

global.ipcRenderer = ipcRenderer
```

In this time, you would be using ipcRenderer through window object in renderer process.

```typescript
export const targetMethod = () => {
  return new Promise(resolve => {
    window.ipcRenderer.once('response-test-event', (ev: IpcRendererEvent, obj: string) => {
      console.log(obj)
      resolve(obj)
    })
    window.ipcRenderer.send('test-event', 'hoge')
  })
}
```

If you don't know why recommend this method, please see https://stackoverflow.com/questions/52236641/electron-ipc-and-nodeintegration .

### Jest
In Jest, please inject ipcRenderer object to global in your test.

```typescript
import { IpcMainEvent } from 'electron'
import { ipcMain, ipcRenderer } from '~/spec/mock/electron'
import { targetMethod } from '~/src/target'

window.ipcRenderer = ipcRenderer

describe('your test', () => {
  it('should be received', async () => {
    ipcMain.once('test-event', (event: IpcMainEvent, obj: string) => {
      event.sender.send('response-test-event', 'response' + obj)
    })
    const res = await targetMethod()
    expect(res).toEqual('responsehoge')
  })
})
```

### Mocha
In Mocha, you can not inejct mock in test. So, please inject ipcRendere object in `preload.js`.

```javascript
import { ipcRenderer } from 'electron'
import { ipcRenderer as mock } from '~/spec/mock/electron'

if (process.env.NODE_ENV === 'test') {
  global.ipcRenderer = mock
} else {
  global.ipcRenderer = ipcRenderer
}
```

And write test.

```typescript
import { IpcMainEvent } from 'electron'
import { targetMethod } from '~/src/target'
import { ipcMain } from '~/spec/mock/electron'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('your test', () => {
  it('should be received', async () => {
    ipcMain.once('test-event', (event: IpcMainEvent, obj: string) => {
      event.sender.send('response-test-event', 'response' + obj)
    })
    const res = await targetMethod()
    expect(res).to.equal('responsehoge')
  })
})
```

## Example
I prepared test example, please refer [here](example).

## License

The software is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
