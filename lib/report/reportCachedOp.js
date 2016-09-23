'use strict';

module.exports = (context, result) => {
    let msg;

    if (result.runtime && !result.action)
        context.report("info", {restored: true, runtime: result.runtime});
    // msg = sprintf('Restored from cache in %s', readableInterval(result.runtime));

    else if (result.savedToCache && result.cacheableOperation)
        context.report("info", {storing: true, runtime: result.cacheableOperation.runtime});
    // msg = sprintf('Operation took %s, storing to cache in the background.',
    //     readableInterval(result.cacheableOperation.runtime));

    if (result.operationRuntime && result.storageRuntime)
        context.report("info", {stored: true, filesize: result.cachedResult.fileSize})
        // msg = sprintf('%s%s saved to cache in %s (operation itself took %s)',
        //     filesize(result.cachedResult.fileSize),
        //     result.cachedResult.compressed ? ' (compressed)' : '',
        //     readableInterval(result.storageRuntime),
        //     readableInterval(result.operationRuntime));

    // if (msg) console.log(chalk.grey(msg));
    // if(msg) context.info()
};