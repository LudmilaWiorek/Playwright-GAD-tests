import { STORAGE_STATE } from '@_pw-config'
import * as fs from 'fs'

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    // if storagestate exist - delete it
    fs.unlinkSync(STORAGE_STATE)
  }
}

export default globalSetup
