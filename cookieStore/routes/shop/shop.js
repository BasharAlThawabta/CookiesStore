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



app.get('/shop', (req, res) => {
    const messageAlert = req.query.message || '';
	const rightClick = req.query.rightClick;
	var email = req.session.email;
	console.log(rightClick, email);
	
    connection.query(`SELECT * FROM sessions`, function (err, items) {
        connection.query(`SELECT * FROM items`, function (err, items) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
				const messageAlert ='';
			}
            res.render(path.join(__dirname, '../../views/shop/shop.ejs'), { items: items, messageAlert: messageAlert });
		});
	});
});

app.get('/order', (req, res) => {
    const messageAlert = '';
	
    connection.query(`SELECT * FROM sessions`, function (err, items) {
        connection.query(`SELECT * FROM items`, function (err, items) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
				const messageAlert ='';
			}
            res.render(path.join(__dirname, '../../views/shop/shop.ejs'), { items: items, messageAlert: messageAlert });
		});
	});
});


app.post('/order', (req, res) => {
    const usertoken = req.sessionID;
    const maxAge = req.session.cookie.maxAge;
    const expiredDate = new Date(Date.now() + maxAge);
    const emailSession = req.session.email;
    const {orderName, ItemQ, ItemPrice, ItemPhoto} = req.body;
	
    if (!emailSession) {
        return res.redirect('/shop?message=Please%20Log%20to%20add%20items%20to%20cart');
		} if(!ItemQ){
		return res.redirect('/shop?message=Please%20Add%20quantity');
		}else {
        connection.query(`INSERT INTO orders (email, orderName, orderQ, OrderPrice, orderPhoto) VALUES (?, ?, ?, ?, ?)`, [emailSession, orderName, ItemQ, ItemPrice, ItemPhoto], function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
			}
            res.redirect('/shop?message=Item%20Added');
		});
	}
});






module.exports = app; 
