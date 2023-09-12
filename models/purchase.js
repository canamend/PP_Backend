const { Schema, model } = require('mongoose');

const PurchaseSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,        
    },
    date: {
        type: Date,
        default: true,
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        default: 0
    }
});

PurchaseSchema.methods.toJSON = function() {
    const { __v, status, _id, ...purchase } = this.toObject();
    purchase.uid = _id;
    return purchase;
}

module.exports = model( 'Purchase', PurchaseSchema );
