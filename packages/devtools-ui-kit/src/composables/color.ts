export function getHslColorFromStringHash(name: string, saturation = 65, lightness = 50, opacity: number | string = 1) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = hash % 360
  return `hsla(${h}, ${saturation}%, ${lightness}%, ${opacity})`
}
