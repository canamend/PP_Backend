const { Category, User, Role, Product } = require('../models');


const isRoleValid = async(role = '') => {

    const roleExists = await Role.findOne( { role } );
    if( !roleExists ){
            throw new Error(`El rol ${ role } no está registrado en la base de datos`);
    }

}

const emailExists = async( email = '') => {
    const existEmail = await User.findOne({ email });
    if( existEmail ){
        throw new Error(`El email ${email} ya está registrado`)
    }   
}

const userExistsById = async( id = '') => {
    const userExists = await User.findById(id);
    if( !userExists ){
        throw new Error(`El id no existe`);
    }   
}

const categoryExistById = async( id = '') =>{
    const categoryExists = await Category.findById(id);
    
    if( !categoryExists ){
        throw new Error(`El id no existe`);
    }
}

const productExists = async( productName = '' ) => {
    const existProduct = await Product.findOne({ name: productName.toUpperCase()});
    if(existProduct){
        throw new Error(`El producto ${productName} ya está en la base de datos`);
    }
}

const productExistById = async( id = '' ) => {
    const existProduct = await Product.findById(id);
    if( !existProduct ){
        throw new Error(`El id no existe`);
    }
}

const allowedColections = async( colection = '', allowedColections = [] ) => {
    const isIncluded = allowedColections.includes( colection );
    if( !isIncluded ){
        throw new Error(`La colección ${colection} no está permitida, por favor ingrese una de las siguientes: ${allowedColections}`)
    }

    return true;
}

module.exports = {
    allowedColections,
    categoryExistById,
    emailExists,
    isRoleValid,
    userExistsById,
    productExists,
    productExistById,
}
    
