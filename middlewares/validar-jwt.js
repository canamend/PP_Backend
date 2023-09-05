const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await User.findById(uid);

        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            })
        }

        //Verificar si el uid tiene state en true
        if( !usuario.state ){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado en false'
            })
        }
        
        req.user = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: "Token no valido"
        });
    }
}

module.exports = {
    validarJWT,
}
