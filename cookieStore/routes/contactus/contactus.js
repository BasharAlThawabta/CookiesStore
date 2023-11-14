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

app.get('/contactus', (req, res) => {
	const messageAlert = '';
	res.render(path.join(__dirname, '../../views/contactus/contactus.ejs'),{ messageAlert: messageAlert });
	
});
app.post('/contactus', (req, res) => {
    const { name, email, message } = req.body;
	
    if (!message) {
        const messageAlert = 'Please fill Your message';
        res.render(path.join(__dirname, '../../views/contactus/contactus.ejs'), { messageAlert: messageAlert,  message:message });
		} else {
        connection.query(`INSERT INTO contactus (name, email, message) VALUES (?, ?, ?)`, [name, email, message], function (err, rows) {
            if (err) throw err;
			const messageAlert = '';
            res.render(path.join(__dirname, '../../views/contactus/contactus.ejs'), { rows: rows, messageAlert:messageAlert, message:message });
			Dicordhook.send(`My name is ${name} my email in ${email} my message is ${message}`);
		});
	}
	
});





module.exports = app; 
