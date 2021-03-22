import path from 'path'
import fs from 'fs'
import envPaths from 'env-paths'
import pkgUp from 'pkg-up'
import dotProp from 'dot-prop'

const get_parent_module_path = () => {
  const _moduleParent = Object.values(require.cache).filter(m =>
    m.children.includes(module)
  )[0]
  return _moduleParent.path
}

// function to detect if variable is a dict object
const isObj = value => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

// make string into array of string, keeping words and arrays intact
// if a string is passed, returns an array with that string as the only item
// if array is passed, returns array unchanged
const arrayify = value => {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value == 'string') {
    return value.split()
  }
}

class AppConfig {
  constructor (options) {
    options = {
      ...options
    }

    if (!options.configDir) {
      // get project name from parent package
      if (!options.projectName) {
        const pkgPath = pkgUp.sync(get_parent_module_path())
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

    // use dot notation to access configuration keys/properties
    // default is true, uses dot-prop
    this._accessByDotNotation = options.accessByDotNotation === false ? false : true

    // define config file path
    const configExt = options.configExt ? `.${options.configExt}` : '.json'
    const configName = options.configName ? `${options.configName}` : 'config'
    this.configPath = path.resolve(
      options.configDir,
      `${configName}${configExt}`
    )

    // handle defaults
    if (options.defaults) {
      this.__defaults = {
        ...options.defaults
      }
    }

    const stored = this.store
    const _store = Object.assign({}, options.defaults, stored)
    this.validate(_store)

    try {
      assert.deepEqual(stored, _store)
    } catch {
      this.store = _store
    }
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
    if (this._accessByDotNotation) {
      return dotProp.get(this.store, key)
    }
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

    if (this._accessByDotNotation) {
      dotProp.set(store, key, value)
    } else {
      store[key] = value
    }

    this.store = store
  }

  has (key) {
    // check if key:value exists in the store
    if (this._accessByDotNotation) {
      return dotProp.has(this.store, key)
    }
    return key in this.store
  }

  delete (key) {
    // delete item from store if key exists
    const store = this.store

    if (this.accessByDotNotation) {
      dotProp.delete(store, key)
    } else {
      delete store[key]
    }

    this.store = store
  }

  reset (keys) {
    keys = arrayify(keys)
    for (const key of keys) {
      if (this._accessByDotNotation) {
        if (dotProp.has(this.__defaults, key)) {
          this.set(key, dotProp.get(this.__defaults, key))
        }
      } else {
        if (key in this.__defaults) {
          this.set(key, this.__defaults[key])
        }
      }
    }
  }

  resetAll () {
    this.store = Object.create(null)
    this.store = this.__defaults
  }
}

module.exports = AppConfig
