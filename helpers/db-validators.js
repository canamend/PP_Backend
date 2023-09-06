const { Category, User, Role, Product, Company, Supplier } = require('../models');


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

const phoneExists = async( phoneNumber = 0, colection = '' ) => {
    let existsPhone;
    switch (colection) {
        case 'users':
            existsPhone = await User.findOne({phoneNumber, status:true});
            break;
        
        case 'companies':
            existsPhone = await Company.findOne({phoneNumber, status:true});        
        break;
        
        case 'suppliers':
            existsPhone = await Supplier.findOne({phoneNumber, status:true});      
        break;
        default:
            throw new Error(`La colección ${colection} no está implementada`);
    }

    if( existsPhone ){
        throw new Error(`El número ${phoneNumber} ya está dado de alta en la coleccion ${colection}`);
    }
}

const nameExists = async( name = '', colection = '' ) => {
    name = name.toUpperCase();
    let existsName;
    switch (colection) {
        case 'users':
            existsName = await User.findOne({name, status:true});
            break;
        
        case 'companies':
            existsName = await Company.findOne({name, status:true});        
        break;
        
        case 'suppliers':
            existsName = await Supplier.findOne({name, status:true});      
        break;
        default:
            throw new Error(`La colección ${colection} no está implementada`);
    }

    if( existsName ){
        throw new Error(`El nombre ${name} ya está dado de alta en la coleccion ${colection}`);
    }
}

const addressExists = async( address = '', colection = '' ) => {
    let existsAddress;
    switch (colection) {
        case 'users':
            existsAddress = await User.findOne({address, status:true});
            break;
        
        case 'companies':
            existsAddress = await Company.findOne({address, status:true});        
        break;
        
        case 'suppliers':
            existsAddress = await Supplier.findOne({address, status:true});      
        break;
        default:
            throw new Error(`La colección ${colection} no está implementada`);
    }

    if( existsAddress ){
        throw new Error(`La dirección ${address} ya está dado de alta en la coleccion ${colection}`);
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

const companyExistsById = async( id = '' ) =>{
    const companyExists = await Company.findById(id);
    
    if( !companyExists ){
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
    addressExists,
    allowedColections,
    categoryExistById,
    emailExists,
    isRoleValid,
    userExistsById,
    companyExistsById,
    phoneExists,
    nameExists,
    productExists,
    productExistById,
}
    
