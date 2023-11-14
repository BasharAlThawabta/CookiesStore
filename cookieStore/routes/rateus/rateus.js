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

app.get('/rateus', (req, res) => {
	
	connection.query(`SELECT * FROM feedback`, function(err,rateus){
		if (err) throw err;
		res.render(path.join(__dirname, '../../views/rateus/rateus.ejs'),{rateus:rateus});
		})
		
});


app.post('/rateus', (req, res) => {
    const { name, email, message, rate } = req.body;
    
    connection.query(
        'INSERT INTO feedback (name, email, message, rate) VALUES (?, ?, ?, ?)',
        [name, email, message, rate],
        function(err, rows) {
            if (err) throw err;
            res.redirect('/rateus');
        }
    );
});


module.exports = app; 
