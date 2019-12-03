import { ipcRenderer } from 'electron'

const index = () => {
  return new Promise(resolve => {
    ipcRenderer.once('response-test-event', (_ev, args: any) => {
      resolve(args)
    })
    ipcRenderer.send('test-event')
  })
}

export default index
