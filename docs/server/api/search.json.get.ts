export default eventHandler(async (event) => {
  return queryCollectionSearchSections(event, 'docs')
})
