var CodeforcesError = function CodeforcesError(message) {
    this.name = 'CodeforcesError';
    this.message = message || '';
    this.stack = (new Error()).stack;
};

CodeforcesError.prototype = new Error();
CodeforcesError.prototype.constructor = CodeforcesError;

module.exports = CodeforcesError;
