const storage = useStorage()

export default eventHandler(async (event) => {
  await storage.setItem('test:json', { hello: true })

  return await storage.getKeys()
})
