const conexion = require('../database/db');

//guardar datos de docentes
exports.registrar = (req, res) => {
    const dni = req.body.dni;
    const primer_nombre = req.body['primer-nombre'];
    const segundo_nombre = req.body['segundo-nombre'] || null;
    const tercer_nombre = req.body['tercer-nombre'] || null;
    const apellido_paterno = req.body['apellido-paterno'];
    const apellido_materno = req.body['apellido-materno'];
    const numero_celular = req.body['celular'] || null;
    const correo_electronico = req.body['correo'] || null;

    conexion.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).send('Error al guardar los datos del Docente');
        }

        const query2 = `
        INSERT INTO Docente (dni, primer_nombre, segundo_nombre, tercer_nombre, apellido_paterno, apellido_materno, numero_de_celular, correo_electronico)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        conexion.query(query2, [dni, primer_nombre, segundo_nombre, tercer_nombre, apellido_paterno, apellido_materno, numero_celular, correo_electronico], (error) => {
            if (error) {
                console.error('Error al insertar en Estudiante:', error);
                return conexion.rollback(() => {
                    res.status(500).send('Error al guardar los datos del Docente');
                });
            }

            conexion.commit((error) => {
                if (error) {
                    console.error('Error al confirmar la transacción:', error);
                    return conexion.rollback(() => {
                        res.status(500).send('Error al guardar los datos del Docente');
                    });
                }
                res.redirect('/convocatoria');
            });
        });
    });
};