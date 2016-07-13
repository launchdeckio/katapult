# katapult

> Build automation tool by launchdeck.io

[![Build Status][travis-image]][travis-url]
[![Code Quality][codeclimate-image]][codeclimate-url]
[![Code Coverage][coveralls-image]][coveralls-url]
[![NPM Version][npm-image]][npm-url]

### Install

```bash
$ npm install -g katapult
```

### Usage

```bash
$ katapult --help

katapult <cmd> [args]

Commands:
  install      Recursively runs the "install" directives starting at the current
               working directory.
  build        Recursively runs the "build" directives starting at the current
               working directory.
  purge        Wipes files not needed in the build based on the the "purge"
               globs.
  clear-cache  Clears the build cache in the configured workspace.
  write-info   Generates a .build-info.json file at the current working
               directory.
  write-sum    Generates a .build-sum.json file at the current working
               directory.

Options:
  -h, --help  Show help                                                [boolean]
  --version   Show version number                                      [boolean]
```

### .katapult.yml

You can automate installation, testing and build routines through the use of .katapult.yml files.
When performing a deployment, katapult will recursively search the root directory for `.katapult.yml` files and run the directives they contain.

#### `install`

Allows the specification of one or more commands that are run before any of the `build` commands are run. `install` commands are run by traversing the build tree, *starting* at the root directory.
If any of the commands exits with a code other than `0`, the deployment is cancelled.

> After execution of the `install` commands in any directory, the build tree is rescanned - `install` commands may thus produce subfolders in turn containing `.katapult.yml` files which will be processed in a same way.

#### `build`

`build` commands are run by traversing the build tree, *ending* at the root directory.
If any of the commands exits with a code other than `0`, the deployment is cancelled.

#### command caching

Commands can be specified using two different types of syntax: plain and simple
```yaml
  - npm install
```
or using a more verbose (associative) syntax. The latter allows you to define additional options on a per-command basis. For now, these options are limited to enabling caching of commands to improve build speed.
```yaml
  - cmd: npm install
    input: package.json
    output: node_modules
```
Katapult will use [johnnycache](https://github.com/launchdeckio/katapult) and store the resulting files of the operation (in this case the entire contents of `node_modules` after running `npm install`) to a `.tar.gz` archive in `.katapult/cache`.

#### `purge`

Allows the specification of one or more globs that will be used to delete unnecessary files; a *blacklist*, if you will. This allows you to, for example, remove the `node_modules` bloat after bundling a script with browserify.
It is also possible to define a "negating glob array" -- meaning all globs start with `!`. Katapult will treat such an array as a *whitelist* and remove all other files in the directory.

#### Example .katapult.yml

```yaml
install:
  - cmd: composer install
    input: composer.lock
    output: vendor

shared:
  - .env
  - web/.htaccess
  - web/app/uploads/

purge:
  - "!config"
  - "!vendor"
  - "!web"
```

### .katapultignore

Directories that match any of the globs specified in a .katapultignore file will not be traversed in the process of scanning for .katapult.yml files.

## License

GNU AGPL v3 © [JM Versteeg](http://github.com/jmversteeg)

[![dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

[travis-image]: https://img.shields.io/travis/launchdeckio/katapult.svg?style=flat-square
[travis-url]: https://travis-ci.org/launchdeckio/katapult

[codeclimate-image]: https://img.shields.io/codeclimate/github/launchdeckio/katapult.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/launchdeckio/katapult

[david-image]: https://img.shields.io/david/launchdeckio/katapult.svg?style=flat-square
[david-url]: https://david-dm.org/launchdeckio/katapult

[david-dev-image]: https://img.shields.io/david/dev/launchdeckio/katapult.svg?style=flat-square
[david-dev-url]: https://david-dm.org/launchdeckio/katapult#info=devDependencies

[coveralls-image]: https://img.shields.io/coveralls/launchdeckio/katapult.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/launchdeckio/katapult

[npm-image]: https://img.shields.io/npm/v/katapult.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/katapult
