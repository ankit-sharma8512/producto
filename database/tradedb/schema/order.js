const { Schema } = require('mongoose');

const Buyer = {
    _id           : false,
    name          : { type: String, required: true },
    gstin         : { type: String },
    contact       : { type: String, required: true },
    address       : { type: String },
    placeOfSupply : { type: String }
}

const Order = {
    _id      : false,
    pid      : { type: String, required: true },
    quantity : { type: Number, required: true },
    rate     : { type: Number, required: true },
    discount : { type: Number, required: true, default: 0 },
    cgst     : { type: Number, required: true, default: 9 },
    sgst     : { type: Number, required: true, default: 9 },
    return   : { type: Number, required: true, default: 0 },
}

const OrderSchema = new Schema({
    billNo  : { type: String, required: true, unique: true },
    date    : { type: Date, required: true, default: new Date() },
    state   : { type: String, enum: ["DRAFT", "DELIVERED", "COMPLETED"], default: "DRAFT" },
    return  : { type: Boolean, default: false },

    buyerId : { type : Schema.Types.ObjectId, ref : 'trader', index : true },
    buyer   : { type : Buyer, default : null, required : function() { return !Boolean(this.buyerId) }},

    order   : [{ type: Order }]
}, { timestamps: true });

module.exports = OrderSchema;