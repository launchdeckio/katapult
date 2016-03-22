# katapult
**Build automation tool by launchdeck.io**

### Install

```bash
$ npm install -g katapult
```

### $ katapult install

**Performs the install procedure in place, as if the working directory was a katapult build.**

The install procedure is normally performed in a temporary folder to get a build ready for deployment. This command can be used to quickly prepare a repository for local development.

### .katapult.yml

You can automate installation, testing and build routines through the use of .katapult.yml files.
When performing a deployment, katapult will recursively search the root directory for `.katapult.yml` files and run the directives they contain.

#### `install`

Allows the specification of one or more commands that are run before any of the `build` commands are run. `install` commands are run by traversing the build tree, *starting* at the root directory.
If any of the commands exits with a code other than `0`, the deployment is cancelled.

> After execution of the `install` commands in any directory, the build tree is rescanned - `install` commands may therefore produce subfolders containing `.katapult.yml` files.

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
Katapult will use [johnnycache](https://github.com/jmversteeg/johnnycache) and store the resulting files of the operation (in this case the entire contents of `node_modules` after running `npm install`) to a `.tar.gz` archive in `.katapult/cache`.

#### `purge (launchdeck.io only)`

Allows the specification of one or more globs that will be used to delete unnecessary files; a *blacklist*, if you will. This allows you to, for example, remove the `node_modules` bloat after bundling a script with browserify.
It is also possible to define a "negating glob array" -- meaning all globs start with `!`. Katapult will treat such an array as a *whitelist* and remove all other files in the directory.

#### `shared (launchdeck.io only)`
(root-only)

Allows the specification of files and directories that should persist throughout multiple deploys. Most notably, this is useful for configuration files such as `.env` and file-based databases or user upload directories.

Directories can be denoted with a trailing `/`.

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