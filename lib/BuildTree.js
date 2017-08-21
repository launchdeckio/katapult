'use strict';

const _ = require('lodash');

class BuildTree {

    /**
     * Get the max number of iterations for the "processAll" scan procedure
     * @returns {number}
     */
    getMaxIterations() {
        return 100;
    }

    /**
     * Return an array of directories
     * @returns {Directory[]|Promise.<Directory[]>}
     */
    scan() {
        return [];
    }

    /**
     * @param {Context} context
     * @param {Function} callback
     * @param {boolean} [reverse = false] Whether to iterate starting depth-first
     * @param {boolean} [rescan = false] Whether to rescan after every iteration
     * @returns {Promise}
     */
    processAll(context, callback, {reverse = false, rescan = false}) {

        let dirsCache = null;

        const processedDirs = [];

        let iterations = 0;

        const getDirsForNextIteration = () => {
            const doScan = (dirsCache === null || rescan);
            return Promise.resolve(doScan ? this.scan() : dirsCache)
                .then(dirs => reverse ? _.reverse(dirs) : dirs);
        };

        const getNextDir = () => {
            return getDirsForNextIteration().then(dirs => {
                return _.find(dirs, dir => !_.includes(processedDirs, dir.absolutePath));
            });
        };

        const iterate = () => {
            iterations++;
            if (iterations > this.getMaxIterations()) {
                console.warn('Exceeded maximum number of iterations while scanning build tree');
                return;
            }
            return getNextDir().then(nextDir => {
                return _.isUndefined(nextDir) ?
                    Promise.resolve() :
                    Promise.resolve(callback(context, nextDir)).then(() => {
                        processedDirs.push(nextDir.absolutePath);
                        return iterate();
                    });
            });
        };

        return iterate();
    }

    /**
     * Runs the install commands in order of ascending depth
     * @param {Context} context
     * @returns {Promise}
     */
    install(context) {
        return this.processAll(context, (context, directory) => directory.install(context), {rescan: true});
    }

    /**
     * Runs the build commands in order of descending depth
     * @param {Context} context
     * @returns {Promise}
     */
    build(context) {
        return this.processAll(context, (context, directory) => directory.build(context), {reverse: true});
    }

    /**
     * Cleans (purges) the build tree based on the purge globs in order of descending depth
     * @param {Context} context
     * @returns {Promise}
     */
    clean(context) {
        return this.processAll(context, (context, directory) => directory.clean(context), {reverse: true});
    }
}

module.exports = BuildTree;