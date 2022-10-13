const { response } = require('express');
const Event = require('../models/Event');



const getEvent = async(req, res = response) => {

    const events = await Event.find()
                                .populate('user', 'name');

    res.json({
        ok: true,
        events
    });

};

const createEvent = async(req, res = response) => {

    // Verificar que tenga el evento
    console.log("🚀 ~ file: event.js ~ line 15 ~ createEvent ~ req", req.body)

    try {

        const event = new Event( req.body );

        event.user = req.uid;

        const eventDB = await event.save();


        res.status(201).json({ // 201 cuando fue creado con exito
            ok: true,
            eventDB
        });
        
    } catch (error) {
        console.log(error);

        res.status(500).json({ // 500 error en el servidor interno
            ok: false,
            msg: 'hablar con admin'
        })

    }

    
    
};

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;

    try {

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({ // 404 cuando no existe
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        };
        
        if( event.user.toString() !== req.uid ){
            return res.status(401).json({ //401 cuando alguien no esta autorizado para hacer algo
                ok: false,
                msg: 'No tiene provilegio de editar este evento'
            })
        };

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const eventUpdate = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            event: eventUpdate
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'hablar con admin'
        })
  
    }
};

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;

    try {

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({ // 404 cuando no existe
                ok: false,
                msg: 'Event no exist for this id'
            });
        }
        
        if( event.user.toString() !== req.uid ){
            return res.status(401).json({ //401 cuando alguien no esta autorizado para hacer algo
                ok: false,
                msg: 'No tiene provilegio de editar este evento'
            })
        };

        await Event.findByIdAndDelete( eventId, { new: true} );

        res.json({
            ok: true,
            msg: 'Event deleted'
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'hablar con admin'
        })
  
    }
};
    

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
};
