export default defineTask({
  meta: {
    name: 'ping',
    description: 'Returns `{ "result": "pong" }`',
  },
  run() {
    return {
      result: 'pong',
    }
  },
})
