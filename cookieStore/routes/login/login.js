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

app.get('/login', (req, res) => {

  const messageAlert = '';
  const items = '';
  const isUser = '';


  if (!req.session.views) {
    req.session.views = {};
  }

  
  const pathname = '/login';


  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;


  res.render(path.join(__dirname, '../../views/login/login.ejs'), {
    messageAlert: messageAlert,
    items: items,
    isUser: isUser,
    viewCount: req.session.views[pathname],
  });


  console.log(`You viewed the '/login' page ${req.session.views[pathname]} times`);
});


app.post('/login', (req, res) => {
    const usertoken = req.sessionID; // Get the session ID
    const maxAge = req.session.cookie.maxAge;
    const expiredDate = new Date(Date.now() + maxAge);
    const { email, password } = req.body;
    let items = '';
	
    if (!email || !password) {
        const messageAlert = 'Please fill The Inputs';
        const isUser = '';
        res.render(path.join(__dirname, '../../views/login/login.ejs'), { messageAlert: messageAlert, items: items, isUser: isUser });
		} else {
        connection.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], function (err, users) {
            if (err) throw err;
            if (users.length > 0 && users[0].user_type === 'admin') {
                req.session.email = email;
                req.session.save(() => {
                    connection.query(`INSERT INTO sessions (email, session_token, expiredDate, CookiemaxAge) VALUES (?, ?, ?, ?)`, [email, usertoken, expiredDate, maxAge], function (err) {
                        if (err) throw err;
                        res.render(path.join(__dirname, '../../views/admin/dashboard.ejs'));
					});
				});
				} else if (users.length > 0 && users[0].user_type === 'user') {
                req.session.email = email;
                
				const phone =  users[0].phonenumber;
                req.session.save(() => {
                    connection.query(`INSERT INTO sessions (email, session_token, expiredDate, CookiemaxAge, phonenumber) VALUES (?, ?, ?, ?, ?)`, [email, usertoken, expiredDate, maxAge, phone], function (err) {
                        if (err) throw err;
                        res.redirect('/shop');
					});
				});
				} else {
                const isUser = 'Invalid Email or Password';
                const messageAlert = '';
                const items = '';
                res.render(path.join(__dirname, '../../views/login/login.ejs'), { messageAlert: messageAlert, items: items, isUser: isUser });
			}
		});
	}
});

app.get('/logout', (req, res) => {

  const emailSession = req.session.email;


  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      
      connection.query(
		  'UPDATE sessions SET expired = ? WHERE email = ?',
        [1, emailSession],
        (err, result) => {
          if (err) {
            console.error('Error updating session:', err);
            res.status(500).send('Error updating session');
          } else {
            res.redirect('/');
          }
        }
      );
    }
  });
});





module.exports = app; 
