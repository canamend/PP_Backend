const { response } = require('express');
const mongoose = require('mongoose');
const Supplier = require('../models/supplier');

const getCompanySuppliers = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const { companyId } = req.params;
    const id = new mongoose.Types.ObjectId(companyId);
    const query = { status: true, company: id };

    const [ total, suppliers ] = await Promise.all([
        Supplier.count(query),
        Supplier.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({path: 'company', select: 'name -_id'})
    ])

    res.json({
        total,
        suppliers
    });
}

const getSupplier = async( req, res = response ) => {
    const { id } = req.params;
    const supplier = await Supplier.findById(id)
                                   .populate({path:'company', select: 'name -_id'});
    res.json({
        supplier
    }) 
}

const putSupplier = async( req, res = response ) => {

    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;

    const suppliersDuplicated = await Supplier.find({$or:[
        { email, status: true },
        { phoneNumber, status: true }]
    });

    let duplicated = [];
    suppliersDuplicated.forEach( supplier  => {
        const { email: dEmail, phoneNumber: dPhoneNumber } = supplier;
        if( !supplier._id.equals(id) ){
            if( dEmail === email )   duplicated.push(email);
            if( dPhoneNumber === phoneNumber )   duplicated.push(phoneNumber);
        }
    });

    if( duplicated.length > 0 ){
        return res.status(400).json({ msg: `Los datos ${duplicated} ya aparecen en la base de datos`})
    }  
    const data = {
        name,
        email,
        phoneNumber,
    }
    const supplier = await Supplier.findByIdAndUpdate( id, data );

    res.json(supplier);
}

const postSupplier = async(req, res = response) => {

    const { status, _id, ...resto } = req.body;
    const supplier = new Supplier( resto );

    //TODO: Guardar en DB

    await supplier.save();

    res.json({
        supplier,
    });
}

const deleteSupplier = async(req, res = response) => {
    
    const { id } = req.params;
    

    //Fisicamente borrado
    const supplier = await Supplier.findByIdAndUpdate( id, { status:false } );
    // const usuarioAutenticado = req.user;

    res.json(supplier);
}

module.exports = {
    getCompanySuppliers,
    getSupplier,
    putSupplier,
    postSupplier,
    deleteSupplier,
}