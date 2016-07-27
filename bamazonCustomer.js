var mysql =require('mysql');
var inquirer = require('inquirer');
var prompt = require('cli-prompt');
var Table = require('cli-table');
var getAllProducts = function(){
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
};
// displaying data by acceptingproduct Id and quantity from the user
var getProdctDetails = function(){
	prompt("Please Enter the required product ID: ", function(val){
		var productID = val;
		prompt("Please Enter the Quantity: ", function(val){
			var quantity = val;
			console.log(productID + quantity);
		}, function(err){
			console.error("error reading Quantity:  " + err);
		});
	}, function(err){
		console.error("error reading product #:  " + err);
	});
};
getProdctDetails();
getAllProducts();

	

	// var sqlQuery = 'SELECT * FROM products WHERE itemID = ' + answer.itemID +
	// 'AND '
	// connection.query(, function(err, res){
	// for (var i = 0; i < res.length; i++){
	// 	table.push(
	// 		[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
	// };
	// console.log(table.toString());
	// });
	
//});


