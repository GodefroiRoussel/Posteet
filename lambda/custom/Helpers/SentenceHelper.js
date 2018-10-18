const getString = function stringGenerator(alexa, string, ...params) {
    const args = [string];
    args.concat(params);
    const res = alexa.t(...args);
};

module.exports = { getString };