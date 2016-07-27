var mysql =require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');
var Table = require('cli-table');
var table = new Table({
	head: ['itemID', 'productName', 'departmentName', 'Price', 'stockQuantity'],
	colWidths: [10, 20, 20, 10, 20]
});
var connection= mysql.createConnection({
	host: "localhost",
	port:3306,
	user:"root",
	password:"1234",
	database: "bamazondb"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
});
//displaying the data in a table format
connection.query('SELECT * FROM products', function(err, res){
	for (var i = 0; i < res.length; i++){
		table.push(
			[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
	};
	console.log(table.toString());
});
// displaying data by acceptingproduct Id and quantity from the user

inquirer.prompt([{
	name: "itemID",
	message: "Please Enter the required product ID?"
	}
]).then(function(answer) {
	console.log(answer.itemID);
	console.log	(answer.itemID.length);
	if (answer.length > 0 ){
			inquirer.prompt([{
			name: "stockQuantity",
			message: "Please Enter the required Quantity of item - "+ answer.itemID + '?'
			}
			]).then(function(qty) {
			if (qty.length > 0 ){
				console.log("DDDDDDDDDDDDDDDD");
			}
		});
	}
	// var sqlQuery = 'SELECT * FROM products WHERE itemID = ' + answer.itemID +
	// 'AND '
	// connection.query(, function(err, res){
	// for (var i = 0; i < res.length; i++){
	// 	table.push(
	// 		[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
	// };
	// console.log(table.toString());
	// });
	
});


