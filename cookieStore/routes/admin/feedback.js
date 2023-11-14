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

app.get('/feedback', (req, res) => {
	
	connection.query(`SELECT * FROM feedback WHERE feedbackDelete IS NULL`, function(err ,message){
		if (err) throw err;
		res.render(path.join(__dirname, '../../views/admin/feedback.ejs'),{message:message});
		
		})	
});

app.get('/feedback/:id', (req, res) => {
	const id = req.params.id;
	
    connection.query(
        `UPDATE feedback SET feedbackDelete = '1' WHERE id = ${id}`,
        function(err, items) {
            if (err) throw err;
            res.redirect('/feedback');
 
		}
	);
});

module.exports = app; 
