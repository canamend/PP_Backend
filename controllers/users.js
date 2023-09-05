const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const usersGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    // const users = await User.find(query)
    //                         .skip(Number(desde))
    //                         .limit(Number(limite));

    // const total = await User.count(query);

    const [ total, users ] = await Promise.all([
        User.count(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        users
    });
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //TODO: Validar contra base de datos
    
    if( password ) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );
    }

    const usuario = await User.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usersPost = async(req, res = response) => {

    const { name, email, password, role} = req.body;
    const usuario = new User( {name, email, password, role} );

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
    const usuario = await User.findByIdAndUpdate( id, { state:false } );
    // const usuarioAutenticado = req.user;

    res.json(usuario);
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
}