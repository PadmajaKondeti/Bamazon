var mysql =require('mysql');
var inquirer = require('inquirer');
var prompt = require('cli-prompt');
var Table = require('cli-table');
var connection= mysql.createConnection({
		host: "localhost",
		port:3306,
		user:"root",
		password:"",
		database: "bamazondb"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
});
var getAllProducts = function(){
	var sqlQuery = "SELECT * FROM products";
	selectDBData(connection, sqlQuery);
	// var table = new Table({
	// 	head: ['itemID', 'productName', 'departmentName', 'Price', 'stockQuantity'],
	// 	colWidths: [10, 20, 20, 10, 20]
	// });


	// //displaying the data in a table format
	// connection.query('SELECT * FROM products', function(err, res){
	// 	for (var i = 0; i < res.length; i++){
	// 		table.push(
	// 			[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
	// 	};
	// 	console.log(table.toString());
	// });
};
// displaying data by acceptingproduct Id and quantity from the user
var getProdctDetails = function(){
	prompt("Please Enter the required product ID: ", function(val){
		var productID = val;
		prompt("Please Enter the Quantity: ", function(val){
			var quantity = val;
			var sqlQuery = 'SELECT * FROM products WHERE itemID = ' + productID + ' AND ' +  quantity +
' < stockQuantity' ;
			
			selectDBData(connection, sqlQuery);
			
		}, function(err){
			console.error("error reading Quantity:  " + err);
		});
	}, function(err){
		console.error("error reading product #:  " + err);
	});
};

var selectDBData = function(connection, sqlQuery){
	connection.query(sqlQuery, function(err, res){
		console.log('response from selectDB function');
		console.log(res);
		if ( res.length ) {
			dataDisplay(res);
			// var table = new Table({
			// 	head: ['itemID', 'productName', 'departmentName', 'Price', 'stockQuantity'],
			// 	colWidths: [10, 20, 20, 10, 20]
			// });
			// for (var i = 0; i < res.length; i++){
			// 	table.push(
			// 	[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
			// };
			// console.log(table.toString());
			// var sqlQuery = 'UPDATE products SET stockQuantity =  stockQuantity - ' + quantity + ' WHERE itemID = ' + productID ;
			// console.log(sqlQuery);
			// connection.query(sqlQuery, function(err, res){
			// });
		} else {
			console.log("Sorry Insufficient quantity");
		}

		return (res);
	});
};
var dataDisplay= function(res){
	var table = new Table({
		head: ['itemID', 'productName', 'departmentName', 'Price', 'stockQuantity'],
		colWidths: [10, 20, 20, 10, 20]
	});
	for (var i = 0; i < res.length; i++){
		table.push(
		[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
	};
	console.log(table.toString());
}
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


