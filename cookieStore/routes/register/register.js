const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const encodeUrl = bodyParser.urlencoded({ extended: false });
const app = express(); 
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cookiestore',
	port: 3306,
});
app.use(encodeUrl);

app.get('/register', (req, res) => {
	
		res.render(path.join(__dirname, '../../views/register/register.ejs'));
		
});
app.post('/register', (req, res) => {
    const { username, email, password, phonenumber} = req.body;
    
    connection.query(
	'INSERT INTO users (username, email, password, phonenumber, user_type) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, phonenumber, 'user'],
        function(err, rows) {
            if (err) throw err;
            res.redirect('/register');
        }
    );
});


module.exports = app; 
