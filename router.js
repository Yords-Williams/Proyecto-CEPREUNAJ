const express = require('express');
const router = express.Router();


const conexion = require('./database/db');
const session = require('express-session')

router.get('/', (req, res) => {
    res.render('index');


})

//ruta para el formulario
router.get('/matricula', (req, res) => {
    res.render('matricula');
})

router.use(session({
    secret: 'soyadmin',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para manejar el inicio de sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Consulta para verificar las credenciales
    const query = 'SELECT * FROM Usuario WHERE Username = ? AND Password = ?';
    conexion.query(query, [username, password], (error, results) => {
        if (error) {
            return res.status(500).send('Error en la base de datos');
        }

        if (results.length > 0) {
            req.session.user = username;
            res.redirect('/folder'); // Redirige a la página de folder
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

//ruta para el login
router.get('/login', (req, res) => {
    res.render('login');
})

//ruta para el folder de matricula
router.get('/folder', (req, res) => {

    conexion.query('SELECT * FROM estudiante', (error, results) => {
        if(error){
            throw error;
        }else{
            res.render('folder', {results:results});
        }
    }) 
})



//ruta para views cursos
router.get('/cursos', (req, res) => {
    res.render('cursos');
})

//ruta para convocatoria
router.get('/convocatoria', (req, res) => {
    res.render('convocatoria');
})

//ruta para inscripcion
router.get('/inscripcion', (req, res) => {
    res.render('inscripcion');
})

//rutar para docente
router.get('/docente', (req, res) => {
    conexion.query('SELECT * FROM docente', (error, results) => {
        if(error){
            throw error;
        }else{
            res.render('docente', {results:results});
        }
    }) 
})

// ruta para clases
router.get('/clases', (req, res) => {
    const estudianteQuery = 'SELECT DNI, Primer_nombre, Segundo_nombre, Apellido_paterno, Apellido_materno FROM Estudiante LIMIT 5';
    const docenteQuery = 'SELECT primer_nombre, segundo_nombre, apellido_paterno, apellido_materno FROM Docente LIMIT 1';
    const asignaturaQuery = 'SELECT Id_de_la_asignatura, Nombre, Id_del_periodo FROM Asignatura LIMIT 1';

    conexion.query(estudianteQuery, (err, estudianteResults) => {
        if (err) {
            return res.status(500).send('Error en la consulta de estudiante');
        }
        conexion.query(docenteQuery, (err, docenteResults) => {
            if (err) {
                return res.status(500).send('Error en la consulta de docente');
            }
            conexion.query(asignaturaQuery, (err, asignaturaResults) => {
                if (err) {
                    return res.status(500).send('Error en la consulta de asignatura');
                }

                if (asignaturaResults.length > 0) {
                    res.render('clases', {
                        estudiante: estudianteResults,
                        docente: docenteResults[0],
                        asignatura: asignaturaResults[0]
                    });
                } else {
                    res.status(404).send('No se encontraron asignaturas');
                }
            });
        });
    });
});

//ruta para login estudiante
router.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Ruta para mostrar el formulario de inicio de sesión de estudiantes
router.get('/student_login', (req, res) => {
    res.render('student_login');
});

// Ruta para manejar el inicio de sesión de estudiantes
router.post('/student_login', (req, res) => {
    const { dni, password } = req.body;
    const query = 'SELECT * FROM Estudiante WHERE DNI = ?';

    conexion.query(query, [dni], (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta de usuario');
        }
        if (results.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }

        const user = results[0];
        const expectedPassword = `Est_${user.DNI}`;
        
        if (password === expectedPassword) {
            req.session.studentId = user.Id;
            req.session.dni = user.DNI;
            res.redirect('/asignatura');
        } else {
            res.status(401).send('Contraseña incorrecta');
        }
    });
});
//ruta para la view asignatura
router.get('/asignatura', (req, res) => {
    const horarioQuery = 'SELECT Dia, Hora_de_inicio, Hora_de_termino FROM horario_de_la_asignatura';
    const asignaturaQuery = 'SELECT Id_de_la_asignatura, Nombre FROM Asignatura';

    conexion.query(horarioQuery, (err, horarioResults) => {
        if (err) {
            return res.status(500).send('Error en la consulta de horario');
        }
        conexion.query(asignaturaQuery, (err, asignaturaResults) => {
            if (err) {
                return res.status(500).send('Error en la consulta de asignatura');
            }
            res.render('asignatura', {
                horario: horarioResults,
                asignaturas: asignaturaResults // Cambié 'asignatura' a 'asignaturas'
            });
        });
    });
});

//ruta para clases2
router.get('/clases2', (req, res) => {
    const estudianteQuery = 'SELECT DNI, Primer_nombre, Segundo_nombre, Apellido_paterno, Apellido_materno FROM Estudiante LIMIT 5 OFFSET 5';
    const docenteQuery = 'SELECT primer_nombre, segundo_nombre, apellido_paterno, apellido_materno FROM Docente LIMIT 1 OFFSET 1';
    const asignaturaQuery = 'SELECT Id_de_la_asignatura, Nombre, Id_del_periodo FROM Asignatura LIMIT 1 OFFSET 1';

    conexion.query(estudianteQuery, (err, estudianteResults) => {
        if (err) {
            return res.status(500).send('Error en la consulta de estudiante');
        }
        conexion.query(docenteQuery, (err, docenteResults) => {
            if (err) {
                return res.status(500).send('Error en la consulta de docente');
            }
            conexion.query(asignaturaQuery, (err, asignaturaResults) => {
                if (err) {
                    return res.status(500).send('Error en la consulta de asignatura');
                }

                if (asignaturaResults.length > 0) {
                    res.render('clases2', {
                        estudiante: estudianteResults,
                        docente: docenteResults[0],
                        asignatura: asignaturaResults[0]
                    });
                } else {
                    res.status(404).send('No se encontraron asignaturas');
                }
            });
        });
    });
});
//ruta para estudiantes
router.get('/estudiantes', (req, res) => {
    res.render('estudiantes');
})
//ruta para grupo
router.get('/grupo', (req, res) => {
    res.render('grupo');
})

// metodo de guardos
const crud = require('./controllers/crud');
router.post('/save', crud.save)

const doc =require('./controllers/doc');
router.post('/registrar', doc.registrar)
module.exports = router;