export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export async function slowTask(ms = 800) {
  await sleep(ms)
  return `done in ${ms}ms`
}

export function fastTask() {
  return 'instant'
}

export async function failingTask() {
  await sleep(200)
  throw new Error('failingTask failed on purpose')
}
