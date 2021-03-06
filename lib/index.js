"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _envPaths = _interopRequireDefault(require("env-paths"));

var _pkgUp = _interopRequireDefault(require("pkg-up"));

var _dotProp = _interopRequireDefault(require("dot-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var get_parent_module_path = function get_parent_module_path() {
  var _moduleParent = Object.values(require.cache).filter(function (m) {
    return m.children.includes(module);
  })[0];
  return _moduleParent.path;
}; // function to detect if variable is a dict object


var isObj = function isObj(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}; // make string into array of string, keeping words and arrays intact
// if a string is passed, returns an array with that string as the only item
// if array is passed, returns array unchanged


var arrayify = function arrayify(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value == 'string') {
    return value.split();
  }
};

var AppConfig = /*#__PURE__*/function () {
  function AppConfig(options) {
    _classCallCheck(this, AppConfig);

    options = _objectSpread({}, options);

    if (!options.configDir) {
      // get project name from parent package
      if (!options.projectName) {
        var _pkgPath = _pkgUp["default"].sync({
          cwd: get_parent_module_path()
        }); // product name detection in case your application package.json has a different productName
        // common with Electron app packaged by electron builder


        options.projectName = _pkgPath && JSON.parse(_fs["default"].readFileSync(_pkgPath, 'utf-8')).productName;
      }

      if (!options.projectName) {
        options.projectName = pkgPath && JSON.parse(_fs["default"].readFileSync(pkgPath, 'utf-8')).name;
      } // if package name not found above


      if (!options.projectName) {
        throw new Error('Project name not found. Please specify `projectName` in options');
      } // add suffix to project name


      var projectSuffix = options.projectSuffix ? "".concat(options.projectSuffix) : ''; // set configuration storage directory

      options.configDir = (0, _envPaths["default"])(options.projectName, {
        suffix: projectSuffix
      }).config;
    } // use dot notation to access configuration keys/properties
    // default is true, uses dot-prop


    this._accessByDotNotation = options.accessByDotNotation === false ? false : true; // define config file path

    var configExt = options.configExt ? ".".concat(options.configExt) : '.json';
    var configName = options.configName ? "".concat(options.configName) : 'config';
    this.configPath = _path["default"].resolve(options.configDir, "".concat(configName).concat(configExt)); // handle defaults

    if (options.defaults) {
      this.__defaults = _objectSpread({}, options.defaults);
    }

    var stored = this.store;

    var _store = Object.assign({}, options.defaults, stored);

    this.validate(_store);

    try {
      assert.deepEqual(stored, _store);
    } catch (_unused) {
      this.store = _store;
    }
  }

  _createClass(AppConfig, [{
    key: "validate",
    value: function validate(data) {
      // make sure data passed is a javascript dictionary object
      var valid = isObj(data);

      if (!valid) {
        throw new Error('Config file data should be a dictionary object');
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      // get value for key in store
      if (this._accessByDotNotation) {
        return _dotProp["default"].get(this.store, key);
      }

      return key in this.store ? this.store[key] : undefined;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      // check type of key
      if (typeof key !== 'string') {
        throw new TypeError("Expected 'key' to be a 'string'");
      } // check type of key


      var wrongValueTypes = ['undefined', 'symbol', 'function'];

      if (wrongValueTypes.includes(_typeof(value))) {
        throw new TypeError("Unsupported value type ".concat(_typeof(value), " for key ").concat(key));
      }

      var store = this.store;

      if (this._accessByDotNotation) {
        _dotProp["default"].set(store, key, value);
      } else {
        store[key] = value;
      }

      this.store = store;
    }
  }, {
    key: "has",
    value: function has(key) {
      // check if key:value exists in the store
      if (this._accessByDotNotation) {
        return _dotProp["default"].has(this.store, key);
      }

      return key in this.store;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      // delete item from store if key exists
      var store = this.store;

      if (this.accessByDotNotation) {
        _dotProp["default"]["delete"](store, key);
      } else {
        delete store[key];
      }

      this.store = store;
    }
  }, {
    key: "reset",
    value: function reset(keys) {
      keys = arrayify(keys);

      var _iterator = _createForOfIteratorHelper(keys),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;

          if (this._accessByDotNotation) {
            if (_dotProp["default"].has(this.__defaults, key)) {
              this.set(key, _dotProp["default"].get(this.__defaults, key));
            }
          } else {
            if (key in this.__defaults) {
              this.set(key, this.__defaults[key]);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "resetAll",
    value: function resetAll() {
      this.store = Object.create(null);
      this.store = this.__defaults;
    }
  }, {
    key: "store",
    get: function get() {
      // getter for store
      try {
        // check if config store file exists
        var data = _fs["default"].readFileSync(this.configPath, 'utf8');

        data = JSON.parse(data); // TODO: add json validator

        return data;
      } catch (error) {
        if (error.code === 'ENOENT') {
          try {
            // directory or file does not exist error
            _fs["default"].mkdirSync(_path["default"].dirname(this.configPath));

            return Object.create(null);
          } catch (error) {
            if (error.code === 'EEXIST') {
              return Object.create(null);
            }
          }
        }

        if (error.name === 'SyntaxError') {
          // other syntax errors
          return Object.create(null);
        }

        return error;
      }
    },
    set: function set(data) {
      // setter for store
      try {
        _fs["default"].mkdirSync(_path["default"].dirname(this.configPath));
      } catch (error) {
        if (!error.code === 'EEXIST') {
          // Config dir exists, some other error
          throw new Error(error);
        }
      }

      this.validate(data); // convert object data to json

      var configData = JSON.stringify(data, null, '\t'); // write config data to config file

      _fs["default"].writeFileSync(this.configPath, configData);
    }
  }, {
    key: "size",
    get: function get() {
      // get number of keys/configs in store
      return Object.keys(this.store).length;
    }
  }]);

  return AppConfig;
}();

module.exports = AppConfig;