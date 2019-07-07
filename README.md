# ElectronMockIPC
[![Build Status](https://travis-ci.com/h3poteto/electron-mock-ipc.svg?branch=master)](https://travis-ci.com/h3poteto/electron-mock-ipc)
[![npm](https://img.shields.io/npm/v/electron-mock-ipc.svg)](https://www.npmjs.com/package/electron-mock-ipc)
[![GitHub release](https://img.shields.io/github/release/h3poteto/electron-mock-ipc.svg)](https://github.com/h3poteto/electron-mock-ipc/releases)

This is a mock library for ipcMain and ipcRenderer in Electron. There are communicate each other, so you can mock ipc methods for your tests without changing your production code.


## Install

```
$ npm install -S electron-mock-ipc
```

or

```
$ yarn add electron-mock-ipc
```

## Usage

At first, please create a file to mock:

```typescript
import createIPCMock from 'electron-mock-ipc'

const mocked = createIPCMock()
const ipcMain = mocked.ipcMain
const ipcRenderer = mocked.ipcRenderer
export { ipcMain, ipcRenderer }
```
and save it as `test/mock/electron-mock.ts`.

Then, please override electron with mock in test. I present a jest example, please write following code in your `package.json`.

```json
  ...
  "jest": {
    "moduleFileExtensions": [
      "ts",
      "js"
    ],
    "moduleNameMapper": {
      "electron": "<rootDir>/test/mock/electron-mock.ts"
    }
  },
  ...
```

After that, all electron instances are mocked, so you can call in tests.

```typescript
import { ipcMain, ipcRenderer } from 'electron'

describe('your test', () => {
  it('should be received', () => {
    const testMessage = 'test'
    ipcMain.once('test-event', (ev: Event, obj: string) => {
      expect(obj).toEqual(testMessage)
    })

    ipcRenderer.send('test-event', testMessage)
  })
})
```


## License

The software is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
