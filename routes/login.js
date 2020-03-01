import express from 'express';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { SEED } from '../config/config';
import Usuario from '../models/usuario';

const app = express();

app.post('/', (req, res) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // Verifica si el usuario existe mediante el email
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        // Verifica la contraseña ingresada
        if (!compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token
        usuarioDB.password = ':)';
        const token = sign({usuario: usuarioDB}, SEED, {expiresIn: 14400}); // 4 horas



        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });


});

export default app;
