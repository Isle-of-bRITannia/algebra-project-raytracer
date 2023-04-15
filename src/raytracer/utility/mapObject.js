// https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
const mapObject = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v)]
    )
  )

export { mapObject }
