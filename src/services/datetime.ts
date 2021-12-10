const { addHours, format } = require("date-fns");

async function Datetime(): Promise<Date>{
    const returnDate = format(addHours(new Date(), 0), 'yyyy-MM-dd HH:MM:SS')
    return returnDate
}

export default Datetime