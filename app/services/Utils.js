const moment = require('moment');

module.exports = {
    currentTime: () => {
        let currMoment = moment();
        return {
            date: currMoment.format('MMM DD, YYYY'),
            time: currMoment.format('hh:mm:ss A')
        };
    },
    dateTimeFromEpoch: (epoch) => {
        return moment.unix(epoch).format('dddd, MMM/DD/YYYY HH:mm Z');
    }
}