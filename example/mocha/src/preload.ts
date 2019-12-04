import { ipcRenderer } from 'electron'
import { ipcRenderer as mock } from '../__mocks__/electron'

if (process.env.NODE_ENV === 'test') {
  ;(global as any).ipcRenderer = mock
} else {
  ;(global as any).ipcRenderer = ipcRenderer
}
