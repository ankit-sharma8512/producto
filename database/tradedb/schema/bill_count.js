const { Schema } = require("mongoose");

const BillCountSchema = new Schema({
    fyear : { type: String, required: true, unique: true },
    count : { type: Number, required: true, default: 0 }
});

module.exports = BillCountSchema;