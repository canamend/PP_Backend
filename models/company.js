const { Schema, model } = require('mongoose');

const CompanySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la empresa'],
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: [true, 'El número de teléfono es obligatorio'],
        unique: true
    },
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
});

CompanySchema.methods.toJSON = function() {
    const { __v, _id, ...company } = this.toObject();
    company.uid = _id;
    return company;
}

module.exports = model('Company', CompanySchema );
