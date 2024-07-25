const express = require('express');
const app = express();
const path = require('path');
const router = require('./router'); 

app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/', require('./router'));

app.listen(5000, () => {
    console.log('EL SERVIDOR ESTA CORRIENDO EN http://localhost:5000');
})