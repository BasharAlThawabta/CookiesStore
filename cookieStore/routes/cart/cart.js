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

app.locals.escape = false;



app.use(encodeUrl);

app.get('/cart', (req, res) => {
    const emailSession = req.session.email;
	
    if (!emailSession) {
        const messageAlert = 'Please log in to view your cart';
		const orders ='';
		const messageSuccess = '';
        res.render(path.join(__dirname, '../../views/cart/cart.ejs'), { messageAlert: messageAlert, orders: orders, messageSuccess:messageSuccess });
		} else {
        connection.query(`SELECT * FROM orders WHERE email = ?`, [emailSession], function (err, orders) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
			}
			const messageSuccess = '';
			const messageAlert = '';
            res.render(path.join(__dirname, '../../views/cart/cart.ejs'), { orders: orders, messageAlert: messageAlert,messageSuccess:messageSuccess  });
		});
	}
});

app.get('/complete', (req, res) => {
    const emailSession = req.session.email;
    const orders = '';
	const messageAlert = '';
	const messageSuccess = 'Thanks For purchase, we will call you as soon as possible!';
    if (!emailSession) {
        const messageAlert = 'Please log in to view your cart';
		const orders ='';
		const messageSuccess = '';
        res.render(path.join(__dirname, '../../views/cart/cart.ejs'), { messageAlert: messageAlert, orders: orders, messageSuccess:messageSuccess });
		} else {
        connection.query(`SELECT * FROM orders WHERE email = ?`, [emailSession], function (err, orders) {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
			}
			res.render(path.join(__dirname, '../../views/cart/cart.ejs'), {
				orders: orders,
				messageAlert: messageAlert,
				messageSuccess: messageSuccess,
				
			});
		});
	}
});

app.post('/cart/:id', (req, res) => {
    const emailSession = req.session.email;
    const id = req.params.id;
    const orders = '';
    const messageAlert = '';
	const messageSuccess = '';
    connection.query(
        `UPDATE orders SET orderDelete = '1' WHERE id = ${id}`,
        function (err, result) {
            if (err) throw err;
			
			
			res.render(path.join(__dirname, '../../views/cart/cart.ejs'), {
				orders: orders,
				messageAlert: messageAlert,
				messageSuccess:messageSuccess
			});
			
		}
	);
});


app.post('/complete', (req, res) => {
	const emailSession = req.session.email;
	const orders = '';
	const messageAlert = '';
	const messageSuccess = 'Thanks For purchase, we will call you as soon as possible!';
	const orderName = req.body.orderName;
	const orderQ = parseInt(req.body.orderQ);
	const orderPrice = parseInt(req.body.orderPrice);
	var TotalPrice = orderQ * orderPrice
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0');
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd;
	
	connection.query(`SELECT * FROM users WHERE email = '${emailSession}'`, function(err, user){
		if (err) throw err;
		
		const phonenumber = user[0].phonenumber;
		
		connection.query(
			`INSERT INTO orders (email, cartPrice, orderComplete, orderDelete, orderName, orderQ, orderPrice, orderDate, phoneNumber) VALUES ('${emailSession}', '${TotalPrice}', 'Order sent', '1', '${orderName}', '${orderQ}', '${orderPrice}', '${today}', '${phonenumber}')`,
			function (err, rows) {
				if (err) throw err;
				
				connection.query(
					`UPDATE orders SET orderComplete = 'complete', cartPrice = '${TotalPrice}', orderDelete = '1', phoneNumber ='${phonenumber}' WHERE email = '${emailSession}' AND orderComplete IS NULL`,
					function (err, result) {
						if (err) throw err;
						
						res.redirect('/complete')
					}
				);
			}
		);
	});
});






module.exports = app; 
