import path from 'path'
import fs from 'fs'
import envPaths from 'env-paths'
import pkgUp from 'pkg-up'

const parentDir = path.dirname((module.parent && module.parent.filename) || '.')
console.log(parentDir)
console.log(module.parent || 'asasa')

class AppConfig {
  constructor (options) {
    options = {
      ...options
    }

    // set project name
    if (!options.projectName) {
      const pkgPath = pkgUp.sync(parentDir)
      options.projectName = pkgPath && JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).name
    }
    if (!options.projectName) {
      throw new Error('Project name not found. Please specify `projectName` option')
    }

    // add suffix to project name
    const projectSuffix = options.projectSuffix ? `${options.projectSuffix}` : ''

    // set configuration storage directory
    if (!options.configDir) {
      options.configDir = envPaths(options.projectName, { suffix: projectSuffix }).config
    }

    // define config file path
    const configExt = options.configExt ? `.${options.configExt}` : '.json'
    const configName = options.configName ? `.${options.configName}` : 'config'
    this.configPath = path.resolve(options.configDir, `${configName}${configExt}`)
  }
}

// const test = new AppConfig()

// console.log(test.configPath)

module.exports = AppConfig
