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


app.get('/ordersprepared', (req, res) => {
		const id = req.params.id;

	connection.query(`SELECT * FROM orders WHERE adminOrder ='Admin Completed' AND submitRevenue IS NULL`, function(err, orders){
		if (err) throw err;
		
			res.render(path.join(__dirname, '../../views/admin/ordersprepared.ejs'), {orders:orders});

		})
	
		
});
app.get('/ordersprepared/:id', (req, res) => {
		const id = req.params.id;

	connection.query(`UPDATE orders SET orderDelivery = 'Delivery Arrived' WHERE id = '${id}'`, function(err, orders){
		if (err) throw err;
		
			res.redirect('/ordersprepared');

		})
	
		
});
app.get('/orderspreparedundo/:id', (req, res) => {
		const id = req.params.id;

	connection.query(`UPDATE orders SET orderDelivery = 'Not Arrived' WHERE id = '${id}'`, function(err, orders){
		if (err) throw err;
		
			res.redirect('/ordersprepared');

		})
	
		
});
app.get('/submitrevenue', (req, res) => {
		
	connection.query(`UPDATE orders SET submitRevenue = 'Revenue Submited' WHERE orderDelivery ='Delivery Arrived'`, function(err, orders){
		if (err) throw err;
		
			res.redirect('/ordersprepared');

		})
	
		
});






module.exports = app; 
