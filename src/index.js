import path from 'path'
import fs from 'fs'
import envPaths from 'env-paths'
import pkgUp from 'pkg-up'
import assert from 'assert'

const parentDir = path.dirname((module.parent && module.parent.filename) || '.')

// function to detect if variable is an object
const isObj = (value) => {
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.getPrototypeOf({})
}

class AppConfig {
  constructor (options) {
    options = {
      ...options
    }

    // get project name from parent package
    if (!options.projectName) {
      const pkgPath = pkgUp.sync(parentDir)
      options.projectName = pkgPath && JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).name
    }
    // if package name not found above
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

    // define store object
    const fileStore = this.store
    const store = Object.assign(Object.create(null), fileStore)
    this.validate(store)

    try {
      assert.strict.deepEqual(fileStore, store)
    } catch (_) {
      this.store = store
    }
  }

  validate (data) {
    const valid = isObj(data)
    if (!valid) {
      const message = 'Config file data should be a dictionary object'
      throw new Error(message)
    }
  }

  get store () {
    // getter for store
    try {
      // check if config store file exists
      let data = fs.readFileSync(this.configPath, 'utf8')

      data = JSON.parse(data)
      // TODO: add json validator
      return data
    } catch (error) {
      if (error.code === 'ENOENT') {
        // directory or file does not exist error
        fs.mkdirSync(path.dirname(this.path))
        return Object.create(null)
      }
      if (error.name === 'SyntaxError') {
        // other syntax errors
        return Object.create(null)
      }
      return error
    }
  }

  set store (data) {
    // setter for store
    fs.mkdirSync(path.dirname(this.configPath))
    this.validate(data)

    // convert object data to json
    const configData = JSON.stringify(data, null, '\t')

    // write config data to config file
    fs.writeFileSync(this.configPath, configData)
  }
}

module.exports = AppConfig
