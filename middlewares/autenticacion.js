import {verify} from 'jsonwebtoken';
import {SEED} from '../config/config';

// =====================================================
// Verificar token
// =====================================================
export function verificaToken(req, res, next) {
    const token = req.query.token;

    verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });
}
