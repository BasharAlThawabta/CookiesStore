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

app.get('/orders/:id', (req, res) => {
		const id = req.params.id;

	 connection.query(`UPDATE orders SET adminOrder = 'Admin Completed', orderComplete ='Order Completed' WHERE id ='${id}'`, function(err, result) {
        if (err) {
            throw err;
        }
        res.redirect('/orders');
    });
	
		
});
app.get('/orders', (req, res) => {
		const id = req.params.id;

	connection.query(`SELECT * FROM orders WHERE orderComplete ='Order sent' AND adminOrder IS NULL`, function(err, orders){
		if (err) throw err;
		
			res.render(path.join(__dirname, '../../views/admin/orders.ejs'), {orders:orders});

		})
	
		
});






module.exports = app; 
