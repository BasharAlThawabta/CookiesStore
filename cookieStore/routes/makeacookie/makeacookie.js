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

app.use(session({
	secret: 'secret key',
	cookie :{maxAge: 90000000},
	saveUninitialized: false
}));

app.use(encodeUrl);

app.get('/makeacookie', (req, res) => {

const emailSession = req.session.email;
	
    if (!emailSession) {
        const messageAlert = 'Please log in to make your own cookie';
		const orders ='';
		const messageSuccess = 'Please log in to make your own cookie';
        res.render(path.join(__dirname, '../../views/makeacookie/makeacookie.ejs'), { messageAlert: messageAlert, orders: orders, messageSuccess:messageSuccess });
		} else {
        connection.query(`SELECT * FROM orders WHERE email = ?`, [emailSession], function (err, orders) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
			}
			const messageSuccess = 'You can Make your own cookie now!';
			const messageAlert = '';
            res.render(path.join(__dirname, '../../views/makeacookie/makeacookie.ejs'), { orders: orders, messageAlert: messageAlert, messageSuccess:messageSuccess });
		});
	}


});


app.post('/makeacookie', (req, res) => {
    
	
	
});







module.exports = app; 
