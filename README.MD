# appconfig

Module for persistant configuration storage node apps. This module is a simpler version of [`conf`](https://github.com/sindresorhus/conf), but is heavily based on it. Avoids use of [`write-file-atomic`](https://github.com/npm/write-file-atomic) and [`make-dir`](https://github.com/sindresorhus/make-dir) because of chown permission errors with Snaps under strict confinement. Also, written in ES6.

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

appConfig.set(key, value) // adds { key: value } to the store

appConfig.get(key) // returns value

appConfig.delete(key) // removes { key: value } from store
```

## Contributing

use `npm run build` to compile `index.js` in `src` folder. Out put in `lib` folder.
[Issues](https://github.com/anujdatar/appconfig/issues)

## License

[MIT](https://github.com/anujdatar/appconfig/blob/master/LICENSE) Copyright (c) 2019 Anuj Datar
