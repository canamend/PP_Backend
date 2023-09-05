const { response, request } = require("express");
const { Product } = require("../models")

const getProducts = async(req, res = response ) =>{
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.count(query),
        Product.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({path: 'user', select: 'name -_id'})
            .populate({path: 'category', select: 'name -_id'})
    ])

    res.json({
        total, 
        products
    })
}

const getProduct = async( req, res = response ) => {
    const { id }  = req.params;
    let productDB = await Product.findById(id)
                                   .populate({path: 'user', select: 'name -_id'})
                                   .populate({path: 'category', select: 'name -_id'});
    res.json({
        productDB,
    })
}

const updateProduct = async(req = request, res = response ) =>{
    const { status, user, _id, ...resto } = req.body;
    const { id } = req.params;

    if(resto.name){
        resto.name = resto.name.toUpperCase();
        const productDB = await Product.findOne({name : resto.name});
        if(productDB){
            if( !productDB._id.equals(id) ){
                return res.status(400).json({
                    msg: `El producto ${ productDB.name } ya existe`
                })
            }
        }
    }
    const product = await Product.findByIdAndUpdate( id, { user: req.user._id, ...resto }, {new: true} );
    res.json(product);
}

const createProduct = async(req, res = response ) => {
    const { status, disponible, name, ...resto } = req.body;
    const nameToDB = name.toUpperCase();

    const data = {
        name: nameToDB,
        ...resto,
        user: req.user._id
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product)

}

const deleteProduct = async(req, res = response ) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { status:false } );

    res.json(product)
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
}