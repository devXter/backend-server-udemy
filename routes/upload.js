import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import Hospital from '../models/hospital';

const app = express();

app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Tipos de coleccion
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: {message: 'Tipo de colección no es válida'}
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: {message: 'Debe seleccionar una imágen'}
        });
    }

    // Obtener nombre del archivo
    const archivo = req.files.imagen;
    const nombreCortado = archivo.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extenciones aceptamos
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Validar que las extensiones del archivo existan en el arreglo
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            error: {message: `Las extensiones válidas son ${extensionesValidas.join(', ')}`}
        });
    }

    // Nombre de archivo personalizado
    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temp al path
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                erros: err
            });
        }
    });

    subirPortipo(tipo, id, nombreArchivo, res);

});

function subirPortipo(tipo, id, nombreArchivo, res) {

    // Validación para subir la imágen del usuario
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: {message: 'Usuario no existe'}
                });
            }

            // Obtener el path antiguo
            const pathViejo = `./uploads/usuarios/${usuario.img}`;

            // Si el path existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Asignamos el nuevo nombre a la imagen
            usuario.img = nombreArchivo;

            // Actualizar la imagen
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    // Validación para subir la imágen del medicos
    if (tipo === 'medicos') {

        // Buscar médico
        Medico.findById(id, (err, medico) => {

            if (!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: {message: 'Medico no existe'}
                });
            }

            // Obtener el path antiguo
            const pathViejo = `./uploads/medicos/${medico.img}`;

            // Si el path existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Asignamos el nuevo nombre a la imagen
            medico.img = nombreArchivo;

            // Actualizar la imagen
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

    // Validación para subir la imágen del hospitales
    if (tipo === 'hospitales') {

        // Buscar si existe el hospital
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: {message: 'Hospital no existe'}
                });
            }

            // Obtener el path antiguo
            const pathViejo = `./uploads/hospitales/${hospital.img}`;

            // Si el path existe se elimina
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Asigno nuevo nombre a la imagen
            hospital.img = nombreArchivo;

            // Actualizo la img
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del hospital actualizada',
                    hospital: hospitalActualizado
                });
            });

        });

    }
}

export default app;
