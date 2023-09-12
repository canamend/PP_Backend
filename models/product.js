const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,        
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stock: {
        type:Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    description: { type: String },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    img: { type: String }
});

ProductSchema.methods.toJSON = function() {
    const { __v, status, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

module.exports = model( 'Product', ProductSchema );
