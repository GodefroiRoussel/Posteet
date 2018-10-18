'use strict';
const dateFns = require('date-fns');

module.exports = class Session {
    constructor(
        userId,
        packages = false,
        dayUsedInARow = 0,
        lastUse = Date.now()
    ) {
        this.userId = userId;
        this.packages = packages;
        this.dayUsedInARow = dayUsedInARow;
        this.lastUse = lastUse;
    }

    hasLaunchTheAppToday() {
        return dateFns.isToday(new Date(this.lastUse));
    }
};