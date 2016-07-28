var mysql =require('mysql');
var inquirer = require('inquirer');
var prompt = require('cli-prompt');
var Table = require('cli-table');
var status = false;
var self = this;
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
	getAllProducts();
	if (self.status == true){
		getProdctDetails();
	}
});
var getAllProducts = function(){
	var sqlQuery = "SELECT * FROM products";
	selectDBData(connection, sqlQuery);
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
		if ( res.length ) {
			dataDisplay(res);
		} else {
			console.log("Sorry Insufficient quantity");
		}
		return (res);
	});
};
var dataDisplay= function(res){
		console.log(self.status);
	var table = new Table({
		head: ['itemID', 'productName', 'departmentName', 'Price', 'stockQuantity'],
		colWidths: [10, 20, 20, 10, 20]
	});
	for (var i = 0; i < res.length; i++){
		table.push(
		[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
	};
	self.status == true;
	console.log(table.toString());
	console.log(self.status);
}