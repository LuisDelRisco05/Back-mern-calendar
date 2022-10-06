/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/Validar-campos');
const { createUser, loginUser, revalidationToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.post(
    '/new', 
    [ //* middlewares
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').isLength({ min: 6 }),
        validarCampos
    ], 
    createUser 
);

router.post('/',  
    [ //* middlewares
        check('email', 'Email is required', ).isEmail(),
        check('password', 'Password is required', ).isLength({ min: 6 }),
        validarCampos
    ],  
loginUser );

router.get('/renew', validarJWT, revalidationToken );

module.exports = router;