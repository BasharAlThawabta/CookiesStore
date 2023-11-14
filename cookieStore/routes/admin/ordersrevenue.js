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


app.get('/ordersrevenue', (req, res) => {
		

	connection.query(`SELECT * FROM orders WHERE adminOrder ='Admin Completed' AND submitRevenue = 'Revenue Submited'`, function(err, orders){
		if (err) throw err;
		
			res.render(path.join(__dirname, '../../views/admin/ordersrevenue.ejs'), {orders:orders});

		})
	
		
});







module.exports = app; 
