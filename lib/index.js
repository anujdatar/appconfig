"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _envPaths = _interopRequireDefault(require("env-paths"));

var _pkgUp = _interopRequireDefault(require("pkg-up"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parentDir = _path["default"].dirname(module.parent && module.parent.filename || '.'); // console.log(parentDir)
// console.log(module.parent.filename)


var AppConfig = function AppConfig(options) {
  _classCallCheck(this, AppConfig);

  options = _objectSpread({}, options); // set project name

  if (!options.projectName) {
    var pkgPath = _pkgUp["default"].sync(parentDir);

    options.projectName = pkgPath && JSON.parse(_fs["default"].readFileSync(pkgPath, 'utf-8')).name;
  }

  if (!options.projectName) {
    throw new Error('Project name not found. Please specify `projectName` option');
  } // add suffix to project name


  var projectSuffix = options.projectSuffix ? "".concat(options.projectSuffix) : ''; // set configuration storage directory

  if (!options.configDir) {
    options.configDir = (0, _envPaths["default"])(options.projectName, {
      suffix: projectSuffix
    }).config;
  } // define config file path


  var configExt = options.configExt ? ".".concat(options.configExt) : '.json';
  var configName = options.configName ? ".".concat(options.configName) : 'config';
  this.configPath = _path["default"].resolve(options.configDir, "".concat(configName).concat(configExt));
}; // const test = new AppConfig()
// console.log(test.configPath)


module.exports = AppConfig;