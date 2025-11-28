export default eventHandler(async (event) => {
  return await queryCollection(event, 'content')
    .where('navigation', '<>', false)
    .all()
})
