# appconfig

Module for persistant configuration storage for node apps. This module is a simpler version of [`conf`](https://github.com/sindresorhus/conf), but is heavily based on it. Avoids use of [`write-file-atomic`](https://github.com/npm/write-file-atomic) and [`make-dir`](https://github.com/sindresorhus/make-dir) because of chown permission errors with Snaps under strict confinement. Also, written in ES6.

## Usage

Install package

```bash
npm i @anujdatar/appconfig
```

For beta/dev branch of package, if a newer test version exists

```bash
npm i @anujdatar/appconfig@next
```

### Basic usage

```js
const appConfig = require('@anujdatar/appconfig')

const config = new appConfig()

config.set(key, value) // adds { key: value } to the store

config.get(key) // returns value

config.delete(key) // removes { key: value } from store
```

### Other options
1. Using defaults
    ```js
    const appConfig = require('@anujdatar/appconfig')

    const appDefaults = {
      'foo': 'abcd',
      'bar': 'pqrs'
    }

    const config = new appConfig({ defaults: appDefaults })

    console.log(config.get('foo'))  // abcd

    config.set('bar', 'wxyz')
    console.log(config.get('bar'))  // wxyz

    // resetting configs
    config.reset('bar')  // for single property
    // or
    config.reset(['foo', 'bar'])  // also accepts a list of properties
    // or reset all props at once
    config.resetAll()
    ```

2. Specify project name explicitly
    ```js
    const config = new appConfig({ projectName: 'my-project' })
    ```

3. Adding a project suffix, if you have multiple apps named the same, or if you're creating an unofficial version of an app and want to distinguish between the two.
    - **projectSuffix**: default is blank

4. Naming the config file: default filename is `config.json`
    - **configName**: default is `config`
    - **configExt**: default is `.json`

5. Using [dot-prop](https://github.com/sindresorhus/dot-prop) notation
    - **accessByDotNotation**: default `true`. If you use nested settings.
    Can be disabled by setting to `false`

## Contributing

use `npm run build` to compile `index.js` in `src` folder. Output in `lib` folder.
[Issues](https://github.com/anujdatar/appconfig/issues)

## Related

Deprecated and not required anymore: [`electron-appconfig`](https://github.com/anujdatar/electron-appconfig) persistent app config storage for electron apps. Old package that used the old `electron.remote`, which is deprecated in the new electron. Makes the app slower, and can be a security concern is used incorrectly.

## License

[MIT](https://github.com/anujdatar/appconfig/blob/master/LICENSE) Copyright (c) 2019 Anuj Datar
