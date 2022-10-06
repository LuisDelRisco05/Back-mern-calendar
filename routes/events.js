/*
    Rutas de Events
    host + /api/events
*/

const { Router } = require("express");
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/event');
const { validarCampos } = require("../middlewares/Validar-campos");
const isDate = require("../helpers/isDate");

const router = Router();

//* Todas las peticiones tienen que pasar por validar token
router.use( validarJWT );

// Obenter eventos
router.get('/', getEvent);

// Crear un nuevo evento
router.post(
    '/', 
    [ //* middlewares
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'date start is required').custom(isDate),
        check('end', 'date end is required').custom(isDate),
        validarCampos
    ],
    createEvent
    );

// Actualizar evento
router.put('/:id', updateEvent);

// Eliminar evento
router.delete('/:id', deleteEvent);

module.exports = router;