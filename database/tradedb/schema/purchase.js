const { Schema } = require('mongoose');

const Vendor = {
    _id     : false,
    name    : { type: String, required: true },
    gstin   : { type: String },
    contact : { type: String, required: true },
    address : { type: String }
}

const Product = {
    _id      : false,
    pid      : { type: String, required: true },
    quantity : { type: Number, required: true },
    price    : { type: Number, required: true },
    mfgDate  : { type: Date, default: null },
    expDate  : { type: Date, default: null }
}

const PurchaseSchema = new Schema({
    date     : { type : Date, required : true, default : new Date() },
    state    : { type : String, enum : ['DRAFT', 'COMPLETED'], default : 'DRAFT'},
    
    vendorId : { type : Schema.Types.ObjectId, ref : 'trader', index : true },
    vendor   : { type : Vendor, default : null, required : function() { return !Boolean(this.vendorId) } },

    total    : { type : Number, default : 0 },
    purchase : [{ type : Product }]
}, { timestamps: true });

module.exports = PurchaseSchema;