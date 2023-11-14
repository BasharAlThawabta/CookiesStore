const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require("express-session");
const path = require('path');
const port = 3000;
const app = express();
const encodeUrl = bodyParser.urlencoded({ extended: false });
const Swal = require('sweetalert2')

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cookieStore',
	port: 3306,
});




app.use(encodeUrl);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


const HomeRoutes = require('./routes/home/home.js');
app.use('/',HomeRoutes);

const LoginRoutes = require('./routes/login/login.js');
app.use('/',LoginRoutes);

const RegisterRoutes = require('./routes/register/register.js');
app.use('/',RegisterRoutes);

const AboutRoutes = require('./routes/about/about.js');
app.use('/',AboutRoutes);

const ContactusRoutes = require('./routes/contactus/contactus.js');
app.use('/',ContactusRoutes);

const RateRoutes = require('./routes/rateus/rateus.js');
app.use('/',RateRoutes);

const ShopRoutes = require('./routes/shop/shop.js');
app.use('/',ShopRoutes);

const CartRoutes = require('./routes/cart/cart.js');
app.use('/',CartRoutes);

const makeACookieRoutes = require('./routes/makeacookie/makeacookie.js');
app.use('/',makeACookieRoutes);



/* ================ADMIN=================*/


const ManageItemsRoutes = require('./routes/admin/manageitems.js');
app.use('/',ManageItemsRoutes);

const DashboardRoutes = require('./routes/admin/dashboard.js');
app.use('/',DashboardRoutes);

const MessagesRoutes = require('./routes/admin/messages.js');
app.use('/',MessagesRoutes);

const orderRoutes = require('./routes/admin/orders.js');
app.use('/',orderRoutes);

const ordersPreparedRoutes = require('./routes/admin/ordersprepared.js');
app.use('/',ordersPreparedRoutes);

const ordersRevenueRoutes = require('./routes/admin/ordersrevenue.js');
app.use('/',ordersRevenueRoutes);

const discountRoutes = require('./routes/admin/discount.js');
app.use('/',discountRoutes);

const feedbackRoutes = require('./routes/admin/feedback.js');
app.use('/',feedbackRoutes);

app.listen(port, ()=>{
console.log('Server is running on Port '+ port);
});