const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const encodeUrl = bodyParser.urlencoded({ extended: false });
const app = express(); 
const Swal = require('sweetalert2');
const chokidar = require('chokidar');
const http = require('http');
const server = http.createServer();
const os = require('node:os'); 
const dns = require('dns');
const fs = require('fs');



const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cookiestore',
	port: 3306,
});






app.use(encodeUrl);

//*** emit
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
//***
const ejsFilePath = path.join(__dirname, '../../views/admin/discount.ejs');
const ejsFileName = path.basename(ejsFilePath);


chokidar.watch(ejsFilePath).on('change', (event, path) => {
	console.log(`File ${ejsFileName} has been modified`);
});

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var hh = today.getHours();
var mi = today.getMinutes();
var se = today.getSeconds();
today = ' [' + yyyy + '-' + mm + '-' + dd + ' ] [' + hh + ':' + mi + ':' + se +'] ';

// fetch ip address functionS
let ipAddress;
let ipAddressV6;

async function ipAdressFunc() {
	try {
		// IPV4
		let response = await fetch('https://api.ipify.org?format=json');
		let data = await response.json();
		ipAddress = data.ip;
		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log('ipv4');
		
		
		} catch (error) {
		console.error('Error fetching IP address:', error);
	}
	// IPV6
	try {
		let responseIpv6 = await fetch('https://api64.ipify.org?format=json');
		let dataIpv6 = await responseIpv6.json();
		ipAddressV6 = dataIpv6.ip;
		await new Promise(resolve => setTimeout(resolve, 5000));
		console.log('ipv6');
		
		} catch (error) {
		console.error('Error fetching IPv6 address:', error);
	}
	
}

ipAdressFunc();


app.get('/discount', (req, res) => {
	let zeroNo = 0;
    const logData = req.query.logData;
	const logInput = req.query.logInput;
	const inputS = req.query.inputS;
	var rightClick = req.query.rightClick;
	var ConsoleLog = req.query.ConsoleLog;
	console.log(ConsoleLog);
	let SQLENV = process.env.SQLENV
	connection.query(SQLENV,[zeroNo], async function(err, discount) {
		if (err) {
			console.error('Error querying the database: ' + err.stack);
			return res.status(500).send('Internal Server Error');
		}
		
		
		
		let url = req.url;
		res.render(path.join(__dirname, '../../views/admin/discount.ejs'), { discount: discount });
		myEmitter.emit('discountPageRequested', `${url} URL was requested at ` + today + '');
		Dicordhook.send(`[ ${url} ] was requested at ` + today + ' By [ IPV4: ' + ipAddress+' ] ' + '[ IPV6: ' + ipAddressV6 +' ]');
		
	});
});

myEmitter.on('discountPageRequested', (message) => {
	
	//const filePath = path.join(__dirname, '../../logs', `Log_${new Date().getTime()}.txt`);
	
	connection.query(`INSERT INTO EVENTS (action, IPv4, IPv6) values ( '${message}', '${ipAddress}', '${ipAddressV6}')`, (error, results, fields) => {
		if (error) throw error;
		// fs.writeFile(filePath, message, (err) => {
		//if (err) throw err;
		//});
	});
});



app.get('/discount/:id', (req, res) => {
	const id = req.params.id;
	
	connection.query(`UPDATE discount SET discountDelete = ? WHERE id = ?`,['1', id], function(err, discount){
		
		res.redirect('/discount');
		
	})
	
	
});

app.post('/discount', (req, res) => {
	const {name, untilDate, discountRate, quantity} = req.body;
	
	
	connection.query(`INSERT INTO discount (name, untilDate, discountRate, quantity, discountDelete) VALUES (?, ?, ?, ?, ?)`,[name, untilDate, discountRate, quantity, '0'], function(err, discount){
		
		res.redirect('/discount');
		
	})
	
	
});


module.exports = app; 

