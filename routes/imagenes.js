import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) { // Regresa un true o false
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});

export default app;


