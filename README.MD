# appconfig

Module for persistant configuration storage for node apps. This module is a simpler version of [`conf`](https://github.com/sindresorhus/conf), but is heavily based on it. Avoids use of [`write-file-atomic`](https://github.com/npm/write-file-atomic) and [`make-dir`](https://github.com/sindresorhus/make-dir) because of chown permission errors with Snaps under strict confinement. Also, written in ES6.

## Usage

Install package

```bash
npm i @anujdatar/appconfig
```

For beta package, if a newer test version exists

```bash
npm i @anujdatar/appconfig@next
```

```js
const appConfig = require('@anujdatar/appconfig')

const conf = new appConfig()

conf.set(key, value) // adds { key: value } to the store

conf.get(key) // returns value

conf.delete(key) // removes { key: value } from store
```

## Contributing

use `npm run build` to compile `index.js` in `src` folder. Output in `lib` folder.
[Issues](https://github.com/anujdatar/appconfig/issues)

## Related

[`electron-appconfig`](https://github.com/anujdatar/electron-appconfig) persistent app config storage for electron apps

## License

[MIT](https://github.com/anujdatar/appconfig/blob/master/LICENSE) Copyright (c) 2019 Anuj Datar
