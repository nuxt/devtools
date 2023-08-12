import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export async function folderSize(folderPath: string): Promise<number> {
  let totalFolderSize = 0
  const folderEntries = await fs.readdir(folderPath, { withFileTypes: true })

  for (const folderEntry of folderEntries) {
    const entryPath = path.join(folderPath, folderEntry.name)

    if (folderEntry.isDirectory()) {
      totalFolderSize += await folderSize(entryPath)
    }
    else if (folderEntry.isFile()) {
      const entryStats = await fs.stat(entryPath)
      totalFolderSize += entryStats.size
    }
  }

  return totalFolderSize
}
