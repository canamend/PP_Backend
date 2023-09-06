const { response, json } = require("express");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
// const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //TODO: Verifical si el email existe
        const user = await User.findOne({email});
        if( !user ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }
        //TODO: Verificar si el user está activo
        if( !user.status  ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - status: false'
            });
        }

        //TODO: Verifical la contraseña
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword  ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Contraseña: incorrecta'
            });
        }
        //TODO: Generar JWT
        const token = await generateJWT( user.id );
        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }

}

// const googleSignIn = async(req, res = response) => {

//     const { id_token } = req.body;

//     try {
//         const { name, img, email} = await googleVerify( id_token );
        
//         let user = await User.findOne( {email} );

//         if( !user ){
//             const data = {
//                 name,
//                 email,
//                 password: ':P',
//                 img,
//                 role: 'USER_ROLE',
//                 google: true
//             };
            
//             user = new User( data );
//             await user.save();
//         }

//         if( !user.state ) {
//             return res.status(401).json({
//                 msg: 'Hable con el admministrador, usuario bloqueado'
//             });
//         }

//         const token = await generateJWT( user.id );

//         res.json({
//             user,
//             token
//         })
//     } catch (error) {
//         json.status(400).json({
//             ok: false,
//             msg: 'El token no se pudo verificar'
//         })
//     }

// }

module.exports = {
    login,
    // googleSignIn
}