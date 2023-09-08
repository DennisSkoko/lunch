import { readFile, writeFile } from 'fs/promises'

export async function read() {
  try {
    return JSON.parse(await readFile(process.env.LUNCH_STORAGE_FILE, 'utf8'))
  } catch (err) {
    if (/** @type {NodeJS.ErrnoException} */ (err).code === 'ENOENT') {
      return []
    }

    throw err
  }
}

/**
 * @param {unknown} data
 */ 
export async function write(data) {
  await writeFile(process.env.LUNCH_STORAGE_FILE, JSON.stringify(data), 'utf8')
}
