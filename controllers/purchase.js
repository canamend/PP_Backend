const { response } = require("express");
const { Purchase } = require("../models");
const mongoose = require('mongoose');

const getCompanyPurchases = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const { companyId } = req.params;
    const id = new mongoose.Types.ObjectId(companyId);
    const query = { company: id };

    const [ total, purchases ] = await Promise.all([
        Purchase.count(query),
        Purchase.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({path: 'user', select: 'name -_id'})
            .populate({path: 'supplier', select: 'name -_id'})
            .populate({path: 'product', select: 'name -_id'})
            .populate({path: 'company', select: 'name -_id'})
    ])

    res.json({
        total,
        purchases
    });
}

const getPurchase = async( req, res = response ) => {
    const { id } = req.params;
    const purchase = await Purchase.findById(id)
                                   .populate({path: 'user', select: 'name -_id'})
                                   .populate({path: 'supplier', select: 'name -_id'})
                                   .populate({path: 'product', select: 'name -_id'})
                                   .populate({path:'company', select: 'name -_id'});
    res.json({
        purchase
    }) 
}

// const updateProduct = async(req = request, res = response ) =>{
//     const { status, user, _id, ...resto } = req.body;
//     const { id } = req.params;

//     if(resto.name){
//         resto.name = resto.name.toUpperCase();
//         const productDB = await Product.findOne({name : resto.name});
//         if(productDB){
//             if( !productDB._id.equals(id) ){
//                 return res.status(400).json({
//                     msg: `El producto ${ productDB.name } ya existe`
//                 })
//             }
//         }
//     }
//     const product = await Product.findByIdAndUpdate( id, { user: req.user._id, ...resto }, {new: true} );
//     res.json(product);
// }

const createPurchase = async(req, res = response ) => {
    const { user, company, date, ...resto } = req.body;
    // const reqCompany = req.user.company;

    const data = {
        ...resto,
        user: req.user._id,
        company: req.user.company,
        date: Date.now()
    }

    const purchase = new Purchase(data);
    await purchase.save();

    res.status(201).json(purchase);

}

// const deleteProduct = async(req, res = response ) => {
//     const { id } = req.params;

//     const product = await Product.findByIdAndUpdate( id, { status:false } );

//     res.json(product)
// }

module.exports = {
    getCompanyPurchases,
    createPurchase,
    getPurchase,
    // updateProduct,
    // deleteProduct,
}