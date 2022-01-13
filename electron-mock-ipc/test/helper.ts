export const sleepMethod = (args: any) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(args), 500)
  })
}
