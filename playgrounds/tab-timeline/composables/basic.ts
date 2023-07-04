export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function doSomething() {
  await sleep(100)
  return 'something'
}
