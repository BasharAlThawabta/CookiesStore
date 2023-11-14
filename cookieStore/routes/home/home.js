const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const encodeUrl = bodyParser.urlencoded({ extended: false });
const app = express(); 
const Swal = require('sweetalert2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cookiestore',
	port: 3306,
});
app.use(encodeUrl);

app.get('/', (req, res) => {
	connection.query(`SELECT * FROM discount WHERE discountDelete = '0'`, function(err, discount){
		
		res.render(path.join(__dirname, '../../views/home/home.ejs'),{discount:discount});
		
	})
	
	
});



module.exports = app; 
