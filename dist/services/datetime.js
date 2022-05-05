"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { addHours, format } = require("date-fns");
async function Datetime() {
    const returnDate = format(addHours(new Date(), 0), 'yyyy-MM-dd HH:MM:SS');
    return returnDate;
}
exports.default = Datetime;
