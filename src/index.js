import path from 'path'
import fs from 'fs'
import envPaths from 'env-paths'
import pkgUp from 'pkg-up'
import dotProp from 'dot-prop'

// Prevent caching of this module so module.parent is always accurate
delete require.cache[__filename]
const parentDir = path.dirname((module.parent && module.parent.filename) || '.')

// function to detect if variable is an object
const isObj = value => {
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.getPrototypeOf({})
}

class AppConfig {
  constructor (options) {
    options = {
      ...options
    }

    if (!options.configDir) {
      // configDir check goes here because pkgUp below returns null on restart after install
      // returns true only after initial install, returns false after subsequent restarts
      // not sure what changes, caching maybe?

      // get project name from parent package
      if (!options.projectName) {
        const pkgPath = pkgUp.sync(parentDir)
        options.projectName =
          pkgPath && JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).name
      }
      // if package name not found above
      if (!options.projectName) {
        throw new Error(
          'Project name not found. Please specify `projectName` in options'
        )
      }

      // add suffix to project name
      const projectSuffix = options.projectSuffix
        ? `${options.projectSuffix}`
        : ''

      // set configuration storage directory
      options.configDir = envPaths(options.projectName, {
        suffix: projectSuffix
      }).config
    }

    // define config file path
    const configExt = options.configExt ? `.${options.configExt}` : '.json'
    const configName = options.configName ? `.${options.configName}` : 'config'
    this.configPath = path.resolve(
      options.configDir,
      `${configName}${configExt}`
    )
  }

  validate (data) {
    // make sure data passed is a javascript dictionary object
    const valid = isObj(data)
    if (!valid) {
      throw new Error('Config file data should be a dictionary object')
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
        try {
          // directory or file does not exist error
          fs.mkdirSync(path.dirname(this.configPath))
          return Object.create(null)
        } catch (error) {
          if (error.code === 'EEXIST') {
            return Object.create(null)
          }
        }
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
    try {
      fs.mkdirSync(path.dirname(this.configPath))
    } catch (error) {
      if (!error.code === 'EEXIST') {
        // Config dir exists, some other error
        throw new Error(error)
      }
    }
    this.validate(data)

    // convert object data to json
    const configData = JSON.stringify(data, null, '\t')

    // write config data to config file
    fs.writeFileSync(this.configPath, configData)
  }

  get size () {
    // get number of keys/configs in store
    return Object.keys(this.store).length
  }

  get (key) {
    // get value for key in store
    return key in this.store ? this.store[key] : undefined
  }

  set (key, value) {
    // check type of key
    if (typeof key !== 'string') {
      throw new TypeError("Expected 'key' to be a 'string'")
    }
    // check type of key
    const wrongValueTypes = ['undefined', 'symbol', 'function']
    if (wrongValueTypes.includes(typeof value)) {
      throw new TypeError(
        `Unsupported value type ${typeof value} for key ${key}`
      )
    }
    const store = this.store
    dotProp.set(store, key, value)

    this.store = store
  }

  has (key) {
    // check of key:value exists in the store
    return dotProp(this.store, key)
  }

  delete (key) {
    // delete item from store if key exists
    const store = this.store
    dotProp.delete(store, key)
    this.store = store
  }

  clearConfig () {
    this.store = Object.create(null)
  }
}

module.exports = AppConfig
