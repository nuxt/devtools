export default defineTask({
  meta: {
    name: 'echo',
    description: 'Returns the input',
  },
  run({ payload }) {
    return payload
  },
})
