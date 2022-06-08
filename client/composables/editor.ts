export async function openInEditor(filepath: string) {
  await rpc.openInEditor(filepath)
}
