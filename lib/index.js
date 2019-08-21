"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _envPaths = _interopRequireDefault(require("env-paths"));

var _pkgUp = _interopRequireDefault(require("pkg-up"));

var _dotProp = _interopRequireDefault(require("dot-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Prevent caching of this module so module.parent is always accurate
delete require.cache[__filename];

var parentDir = _path["default"].dirname(module.parent && module.parent.filename || '.'); // function to detect if variable is an object


var isObj = function isObj(value) {
  var prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.getPrototypeOf({});
};

var AppConfig =
/*#__PURE__*/
function () {
  function AppConfig(options) {
    _classCallCheck(this, AppConfig);

    options = _objectSpread({}, options);

    if (!options.configDir) {
      // configDir check goes here because pkgUp below returns null on restart after install
      // returns true only after initial install, returns false after subsequent restarts
      // not sure what changes, caching maybe?
      // get project name from parent package
      if (!options.projectName) {
        var pkgPath = _pkgUp["default"].sync(parentDir);

        options.projectName = pkgPath && JSON.parse(_fs["default"].readFileSync(pkgPath, 'utf-8')).name;
      } // if package name not found above


      if (!options.projectName) {
        throw new Error('Project name not found. Please specify `projectName` in options');
      } // add suffix to project name


      var projectSuffix = options.projectSuffix ? "".concat(options.projectSuffix) : ''; // set configuration storage directory

      options.configDir = (0, _envPaths["default"])(options.projectName, {
        suffix: projectSuffix
      }).config;
    } // define config file path


    var configExt = options.configExt ? ".".concat(options.configExt) : '.json';
    var configName = options.configName ? ".".concat(options.configName) : 'config';
    this.configPath = _path["default"].resolve(options.configDir, "".concat(configName).concat(configExt));
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
      return key in this.store ? this.store[key] : undefined;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      // check type of key
      if (typeof key !== 'string') {
        throw new TypeError('Expected \'key\' to be a \'string\'');
      } // check type of key


      var wrongValueTypes = ['undefined', 'symbol', 'function'];

      if (wrongValueTypes.includes(_typeof(value))) {
        throw new TypeError("Unsupported value type ".concat(_typeof(value), " for key ").concat(key));
      }

      var store = this.store;

      _dotProp["default"].set(store, key, value);

      this.store = store;
    }
  }, {
    key: "has",
    value: function has(key) {
      // check of key:value exists in the store
      return (0, _dotProp["default"])(this.store, key);
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      // delete item from store if key exists
      var store = this.store;

      _dotProp["default"]["delete"](store, key);

      this.store = store;
    }
  }, {
    key: "clearConfig",
    value: function clearConfig() {
      this.store = Object.create(null);
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