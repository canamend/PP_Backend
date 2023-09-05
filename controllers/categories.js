const { response, request } = require("express");
const { Category } = require("../models")

const getCategories = async(req, res = response ) =>{
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
        Category.count(query),
        Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({path: 'user', select: 'name -_id'})
    ])

    res.json({
        total, 
        categories
    })
}

const getCategory = async( req, res = response ) => {
    const { id }  = req.params;
    let categoryDB = await Category.findOne({_id : id})
                                   .populate({path: 'user', select: 'name -_id'});
    res.json({
        categoryDB,
    })
}

const updateCategory = async(req = request, res = response ) =>{
    let { name } = req.body;
    const { id } = req.params;
    name = name.toUpperCase();
    const categoryDB = await Category.findOne({ name });
    if( categoryDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoryDB.name } ya existe`
        })
    }

    const category = await Category.findByIdAndUpdate( id, { name : name.toUpperCase(), user: req.user._id }, {new: true} );
    res.json(category);
}

const createCategory = async(req, res = response ) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if( categoryDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoryDB.name } ya existe`
        })
    }

    const data = {
        name,
        user: req.user._id,
    }

    const category = new Category(data);
    await category.save();

    res.status(201).json(category)

}

const deleteCategory = async(req, res = response ) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { status:false } );

    res.json(category)
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
}