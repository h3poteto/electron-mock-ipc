# ElectronMockIPC
[![Test](https://github.com/h3poteto/electron-mock-ipc/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/h3poteto/electron-mock-ipc/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/electron-mock-ipc.svg)](https://www.npmjs.com/package/electron-mock-ipc)
[![GitHub release](https://img.shields.io/github/release/h3poteto/electron-mock-ipc.svg)](https://github.com/h3poteto/electron-mock-ipc/releases)
[![npm](https://img.shields.io/npm/dm/electron-mock-ipc)](https://www.npmjs.com/package/electron-mock-ipc)
[![NPM](https://img.shields.io/npm/l/electron-mock-ipc)](/LICENSE.txt)

This is a mock library for ipcMain and ipcRenderer in Electron. They communicate with each other, so you can mock ipc methods in your tests without changing your production code.


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


### Jest
In Jest, please replace electron object using `moduleNameMapper`. Please override it in `package.json`.

```json
  "jest": {
    "moduleNameMapper": {
      "^electron$": "<rootDir>/spec/mock/electron-mock.ts"
    }
  }
```

After that, all ipc objects are mocked, so you can write tests as below.

```typescript
import { IpcMainEvent } from 'electron'
import { ipcMain } from '~/spec/mock/electron-mock'
import { targetMethod } from '~/src/target'

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
In Mocha, you can not inject a mock object easily. So, please inject the ipcRenderer object in `preload.js`, and use `preload.js` to load electron.

```javascript
import { ipcRenderer } from 'electron'
import { ipcRenderer as mock } from '~/spec/mock/electron-mock'

if (process.env.NODE_ENV === 'test') {
  global.ipcRenderer = mock
} else {
  global.ipcRenderer = ipcRenderer
}
```

`preload.js` is used to disable nodeIntegration, please refer [here](https://stackoverflow.com/questions/52236641/electron-ipc-and-nodeintegration).


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
I prepared a test example, please refer [here](example).

## License

The software is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
