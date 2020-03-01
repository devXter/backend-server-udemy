// Requires
import express from 'express';
import { connection } from 'mongoose';
import { urlencoded, json } from 'body-parser';

// Importar Rutas
import appRoutes from './routes/app';
import usuarioRoutes from './routes/usuario';
import hospitalRoutes from './routes/hospital';
import busquedaRoutes from './routes/busqueda';
import medicoRoutes from './routes/medico';
import uploadRoutes from './routes/upload';
import imagenesRoutes from './routes/imagenes';
import loginRoutes from './routes/login';

// Inicializar Variables
const app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));

// parse application/json
app.use(json());


// Conexión a la base de datos
connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);

app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});

