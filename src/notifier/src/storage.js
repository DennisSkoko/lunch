import { readFile } from 'fs/promises'

/**
 * @returns {Promise<Restaurant[]>}
 */
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
