import express from 'express';
import Hospital from '../models/hospital';
import {verificaToken} from "../middlewares/autenticacion";

const app = express();

// =====================================================
// Obtener todos los hospitales
// =====================================================
app.get('/', (req, res, next) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar Hospital',
                        errors: err
                    });
                }

                Hospital.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
            }
        );
});

// =====================================================
// Actualizar Hospital
// =====================================================
app.put('/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Hospital.findById(id, (err, hospital) => {

        // Verifica si hay un error en el servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        // Verifica si existe el hospital
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el ${id} no existe`,
                errors: {message: 'No existe el hospital con ese ID'}
            });
        }

        // Asignar la modificación del usuario
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        // Guarda la modificación del hospital
        hospital.save((err, hospitalGuardado) => {

            // Verifica si hay un error al guardar
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            // Guarda exitósamente al hospital modificado
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });

    });
});

// =====================================================
// Crear un nuevo hospital
// =====================================================
app.post('/', verificaToken, (req, res) => {
    const body = req.body;

    const hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// =====================================================
// Borrar un hospital por el id
// =====================================================
app.delete('/:id', verificaToken, (req, res) => {
    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});

export default app;
