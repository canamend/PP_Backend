const { response } = require("express");
const { User, Product, Category } = require("../models");
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async(term = '', res = response) => {
    
    const isMongoID = ObjectId.isValid( term );
    if( isMongoID ){
        const user = await User.findById(term);
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp(term, 'i')

    const users = await User.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{state:true}]
    });

    res.json({
        results: users
    });


}

const searchCategories = async(term = '', res = response) => {
    
    const isMongoID = ObjectId.isValid( term );
    if( isMongoID ){
        const category = await Category.findById(term);
        return res.json({
            results: ( category ) ? [ category ] : []
        });
    }

    const regex = new RegExp(term, 'i')

    const categories = await Category.find({status:true, name: regex});

    res.json({
        results: categories
    });


}

const searchProducts = async(term = '', res = response) => {
    
    const isMongoID = ObjectId.isValid( term );
    if( isMongoID ){
        const product = await Product.findById(term).populate('category', 'name -_id');
        return res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regex = new RegExp(term, 'i')

    const products = await Product.find({ name: regex, status:true }).populate('category', 'name -_id');

    res.json({
        results: products
    });


}


const search = (req, res = response) => {
    const { colection, term } = req.params;
    if( !allowedCollections.includes( colection ) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ allowedCollections }`
        })
    }

    switch (colection) {
        case 'users':
            searchUsers(term, res);
        break;

        case 'categories':
            searchCategories(term, res);
        break;

        case 'products':
            searchProducts(term, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
            break;
    }
}

module.exports = {
    search
}