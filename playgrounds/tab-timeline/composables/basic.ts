export function myFunctionA(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function myFunctionB() {
  await myFunctionA(2000)
  return 'something'
}
