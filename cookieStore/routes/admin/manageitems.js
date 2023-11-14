const express = require('express');
const path = require('path');
const fs = require("fs");
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const encodeUrl = bodyParser.urlencoded({ extended: false });
const app = express(); 
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '.png');
    }
});

const upload = multer({ storage: storage });


app.use(express.static(path.join(__dirname, 'public')));



const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cookiestore',
	port: 3306,
});
app.use(encodeUrl);

const handleError = (err, res) => {
	res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};




app.get('/manageitems', (req, res) => {
	connection.query(`SELECT * FROM items`, function(err, items){
		if (err) throw err;
		res.render(path.join(__dirname, '../../views/admin/manageitems.ejs'),{items:items});
	})
	
	
});
app.post('/manageitems', upload.single('ItemPHOTO'), (req, res) => {
    const { ItemName, ItemQ, ItemDESC, ItemPHOTO, ItemPrice } = req.body;

    connection.query(
        'INSERT INTO items (ItemName, ItemQ, ItemDESC, ItemPHOTO, ItemPrice) VALUES (?, ?, ?, ?, ?)',
        [ItemName, ItemQ, ItemDESC, req.file.filename, ItemPrice],
        function(err, items) {
            if (err) throw err;
            res.redirect('/manageitems');
		}
	);
});

app.post('/manageitems/:id', (req, res) => {
	const id = req.params.id;
    connection.query(
        `UPDATE items SET ItemDelete = '1' WHERE id = ${id}`,
        function(err, items) {
            if (err) throw err;
            res.redirect('/manageitems');
 
		}
	);
});



app.post('/edit_items/:id', upload.single('ItemPHOTO'), function(req, res) {
    var id = req.params.id;
    const { ItemName, ItemQ, ItemDESC, ItemPrice } = req.body;
    const ItemPHOTO = req.file ? req.file.filename : null;

    connection.query(
        `UPDATE items SET ItemName=?, ItemQ=?, ItemDESC=?, ItemPrice=? WHERE id=?`,
        [ItemName, ItemQ, ItemDESC, ItemPrice, id],
        function(err, result) {
            if (err) throw err;
            res.redirect('/manageitems');
        }
    );
});



module.exports = app; 
