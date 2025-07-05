const moment = require("moment");

const BILL_SEQ_LEN = 5;

function getBillNo(seq, label, date, sub = '') {
    const seqNumber = String(seq).padStart(BILL_SEQ_LEN, '0');

    return `ST/${sub}${label}/${moment(date).format('MM')}/${seqNumber}`;
}

function getCurrentFinancialYearFilter(timestamp) {
    const currTime   = timestamp ? moment(timestamp) : moment();
    const currMonth  = Number(currTime.format('M'));
    const currYear   = Number(currTime.format('YYYY'));
    const currYearS  = Number(currTime.format('YY'));

    const yearOffset = currMonth <= 3 ? [-1, 0] : [0, 1];

    const year       = [currYear  + yearOffset[0], currYear  + yearOffset[1]];
    const yearS      = [currYearS + yearOffset[0], currYearS + yearOffset[1]];

    const startOfYear = moment(`${year[0]}-04-01`).startOf('day').toISOString();
    const endOfYear   = moment(`${year[1]}-03-31`).endOf('day').toISOString();

    return {
        filter : { date: { $gte: new Date(startOfYear), $lte: new Date(endOfYear) } },
        label  : yearS.join('-')
    };
}

module.exports = {
    getBillNo,
    getCurrentFinancialYearFilter
}