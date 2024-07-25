const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'cepre'
});

conexion.connect((error) => {
    if(error){
        console.error('El error de concexion es '+error);
        return
    }
    console.log('¡Conectado a la BD MySQL!');
})

module.exports = conexion;