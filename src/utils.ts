import { execSync } from 'child_process'
import { readFile, writeFile } from 'fs'

export const run = (command: string) => {
  try {
    execSync(`${command}`, { stdio: 'ignore' })
  } catch (e) {
    console.error(`Failed to execute command ${command}`, e)
    return false
  }
  return true
}

export const replace = (path: string, old: string | RegExp, replacement: string) => {
  readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    const result = data.replace(old, replacement)

    writeFile(path, result, 'utf8', function (err) {
      if (err) {
        console.error(err)
        process.exit(-1)
      }
    })
  })
}
