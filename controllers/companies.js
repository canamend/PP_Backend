const { response, request } = require("express");
const { Company } = require("../models")

const createCompany = async(req, res = response ) => {
    const { _id, status, ...resto } = req.body;
    resto.name = resto.name.toUpperCase();
    
    const data = {
        ...resto
    }

    const company = new Company(data);
    await company.save();

    res.status(201).json({company})

}

const getCompanies = async(req, res = response ) =>{
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [ total, companies ] = await Promise.all([
        Company.count(query),
        Company.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total, 
        companies
    })
}

const getCompany = async( req, res = response ) => {
    const { id }  = req.params;
    let companyDB = await Company.findOne({_id : id});
    res.json({
        companyDB,
    })
}

const updateCompany= async(req = request, res = response ) =>{
    const { _id, status, ...resto } = req.body;
    const { id } = req.params;
    resto.name = resto.name.toUpperCase();

    const companiesDuplicated = await Company.find({$or:[
            { name      : resto.name, status: true },
            { address   : resto.address, status: true },
            { phoneNumber : resto.phoneNumber, status: true }]
        });
    
    let duplicated = [];
    companiesDuplicated.forEach( company  => {
        const { name, address, phoneNumber } = company;
        if( !company._id.equals(id) ){
            if( name === resto.name )   duplicated.push(name);
            if( phoneNumber === resto.phoneNumber )   duplicated.push(phoneNumber);
            if( address === resto.address )   duplicated.push(address);
        }
    });

    if( duplicated.length > 0 ){
        return res.status(400).json({ msg: `Los datos ${duplicated} ya aparecen en la base de datos`})
    }    

    data = {
        ...resto
    }

    const company = await Company.findByIdAndUpdate( id, data, {new: true} );
    res.json(company);
}


const deleteCompany = async(req, res = response ) => {
    const { id } = req.params;

    const company = await Company.findByIdAndUpdate( id, { status:false } );

    res.json(company)
}

module.exports = {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany
}