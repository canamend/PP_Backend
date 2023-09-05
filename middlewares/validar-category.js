const { request, response } = require("express");
const { Category } = require("../models");



const validarCategoryId = async( req = request, res = response, next ) => {
    const category = await Category.findOne({_id : req._id});
    
    if( !category ){
        return res.status(500).json({
            msg: 'No existe categoria con ese id'
        });
    }

    next();
}

module.exports = {
    validarCategoryId
}