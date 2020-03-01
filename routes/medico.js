import express from 'express';
import Medico from '../models/medico';
import {verificaToken} from "../middlewares/autenticacion";

const app = express();

// =====================================================
// Obtener todos los medicos
// =====================================================
app.get('/', (req, res, next) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre usuario hospital')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
                if (err) {
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'Error al obtener a los médicos',
                        errors: err
                    });
                }

                Medico.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            }
        );
});

// =====================================================
// Crear un nuevo medico
// =====================================================
app.post('/', verificaToken, (req, res, next) => {
    const body = req.body;

    const medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// =====================================================
// Actualizar medico
// =====================================================
app.put('/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: {message: 'No existe un medico con ese ID'}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// =====================================================
// Borrar un medico por el id
// =====================================================
app.delete('/:id', verificaToken, (req, res) => {
    const id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

export default app;
