const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateJWT = require('../helpers/jwt');



const createUser =  async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await User.findOne({ email });

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'There is already a user with this email'
            })
        }

        usuario = new User( req.body );

        // Encriptar contraseña
         const salt = bcrypt.genSaltSync();
         usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        // Generar JWT
        const token = await generateJWT( usuario.id, usuario.name );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'talk to admin'
        })
    }

}

const loginUser =  async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await User.findOne({ email });

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'User does not exist with this email'
            })
        }

        // Confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password invalid'
            });
        }

        // Generar JWT
        const token = await generateJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Talk to admin'
        })
        
    }


}

const revalidationToken =  async(req, res = response) => {

    const { uid, name } = req;

    // Generar nuevo token
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token
    })

}


module.exports = {
    createUser,
    loginUser,
    revalidationToken
}