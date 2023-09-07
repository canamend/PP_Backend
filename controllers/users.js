const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const usersGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.count(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({path: 'company', select: 'name -_id'})
    ])

    res.json({
        total,
        users
    });
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;
    let { password } = req.body;
    
    const usersDuplicated = await User.find({$or:[
        { email, status: true },
        { phoneNumber, status: true }]
    });

    let duplicated = [];
    usersDuplicated.forEach( user  => {
        const { email: dEmail, phoneNumber: dPhoneNumber } = user;
        if( !user._id.equals(id) ){
            if( dEmail === email )   duplicated.push(email);
            if( dPhoneNumber === phoneNumber )   duplicated.push(phoneNumber);
        }
    });

    if( duplicated.length > 0 ){
        return res.status(400).json({ msg: `Los datos ${duplicated} ya aparecen en la base de datos`})
    }  
    
    if( password ) {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync( password, salt );
    }

    const data = {
        name,
        email,
        phoneNumber,
        password
    }
    const usuario = await User.findByIdAndUpdate( id, data );

    res.json(usuario);
}

const usersPost = async(req, res = response) => {

    const { status, _id, password, ...resto } = req.body;
    const usuario = new User( resto );

    //TODO: Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt )

    //TODO: Guardar en DB

    await usuario.save();

    res.json({
        usuario,
    });
}

const usersDelete = async(req, res = response) => {
    
    const { id } = req.params;
    

    //Fisicamente borrado
    const usuario = await User.findByIdAndUpdate( id, { status:false } );
    // const usuarioAutenticado = req.user;

    res.json(usuario);
}
module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
}