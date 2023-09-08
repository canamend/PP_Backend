const { Schema, model} = require('mongoose');

const SupplierSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    phoneNumber: {
        type: Number,
        required: [true, 'El número de teléfono es obligatorio'],
        unique: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    img: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
});

SupplierSchema.methods.toJSON = function() {
    const { __v, password, _id, ...supplier } = this.toObject();
    supplier.uid = _id;
    return supplier;
}

module.exports = model( 'Supplier', SupplierSchema);