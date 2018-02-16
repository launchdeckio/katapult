'use strict';

const formulateMessage = ({command, code, signal}) => {
    return code ?
        `The process ${command ? `"${command}" ` : ''}exited with ${code ? `code ${code}` : 'non-zero'}` :
        `The process ${command ? `"${command}" ` : ''}was terminated (${signal})`;
};

class ProcessFailedError extends Error {

    constructor({command, code, signal} = {}) {
        super();
        this.message = formulateMessage({command, code, signal});
        this.process = command;
        this.code    = code;
        this.signal  = signal;
    }
}

module.exports = ProcessFailedError;