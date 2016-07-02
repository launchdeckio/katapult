'use strict';

const _ = require('lodash');

class TaskQueue {

    constructor() {
        this.queue = [];
    }

    /**
     * Add the given promise to the "finalisation queue" i.e. an array of promises that will be awaited before definitively
     * exiting
     * @param {Promise} task
     */
    push(task) {
        let obj = {
            done:    false,
            promise: task
        };
        task.then(() => obj.done = true);
        this.queue.push(obj);
    }

    /**
     * Determine whether there are unresolved tasks
     * @returns {boolean}
     */
    hasTasksPending() {
        return _.some(this.queue, obj => !obj.done);
    }

    /**
     * Wait until all tasks have completed (and empties the queue afterwards)
     * @returns {Promise}
     */
    finalize() {
        return Promise.all(_.map(this.queue, obj => obj.promise)).then(() => {
            this.queue = []
        });
    }
}

module.exports = TaskQueue;