var mysql =require('mysql');
var inquirer = require('inquirer');
//var prompt = require('cli-prompt');
var Table = require('cli-table');
var connection= mysql.createConnection({
		host: "localhost",
		port:3306,
		user:"root",
		password:"",
		database: "bamazondb"
});

// Create a "Prompt" with a series of questions.
inquirer.prompt([
	// Here we give the user a list to choose from.
	{
		type: "list",
		message: "Menu Options",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
		name: "menu"
	}
// Once we are done with all the questions... "then" we do stuff with the answers
// In this case, we store all of the answers into a "user" object that inquirer makes for us. 
]).then(function (user) {
	// If we log that user as a JSON, we can see how it looks.
	console.log(JSON.stringify(user, null, 2));

	// If the user confirms, we displays the user's name and pokemon from the answers. 
	connection.connect(function(err){
		if (err) throw err;
		console.log("connected as id " + connection.threadId);
		switch (user.menu){
			case  ("View Products for Sale"):
				console.log("View Products for Sale");
				getAllProducts();
				connection.end();
				break;
			case  ("View Low Inventory"):
				console.log("View Low Inventory");
				getLowInventory();
				connection.end();
				break;
			case  ("Add to Inventory"):
				console.log("Add to Inventory");
				promptCustomer("Add to Inventory");
				break;
			case  ("Add New Product"):
				console.log("Add New Product");
				promptCustomer("Add New Product");
				//connection.end();
				break;
			default:
				connection.end();
				break;
		}
		//	
	});
});
var getAllProducts = function(){
	var sqlQuery = "SELECT * FROM products";
	connection.query(sqlQuery, function(err, res){
		if ( res.length ) {
			var table = new Table({
				head: ['ItemID', 'ProductName', 'DepartmentName', 'Price/Item', 'AvailQty'],
				colWidths: [10, 20, 20, 15,10]
			});
			for (var i = 0; i < res.length; i++){
				table.push(
				[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity]);
			};
			console.log(table.toString());	
		};	
	});
};
var getLowInventory = function(){
	var sqlQuery = "SELECT * FROM products WHERE stockQuantity < 5";
	connection.query(sqlQuery, function(err, res){
		if ( res.length ) {
			var table = new Table({
				head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
				colWidths: [10, 20, 20, 10]
			});
			for (var i = 0; i < res.length; i++){
				table.push(
				[res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity]);
			};
			console.log(table.toString());	
		};	
	});
};
var addInventory = function(productID, quantity){
	console.log(productID, quantity);
	var sqlQuery = 'UPDATE products SET stockQuantity = stockQuantity + ' + quantity + ' WHERE ItemID = ' + productID ;
	connection.query(sqlQuery, function(err, res){
		if (err) throw err;
		var sqlQuery = 'SELECT * FROM Products WHERE ItemID= '+ productID ;
		connection.query(sqlQuery, function(err, res){
			if (err) throw err;
			var table = new Table({
				head: ['itemID', 'productName', 'DepartmentName', 'Price', 'Quantity'],
				colWidths: [10, 20, 20, 10, 10]
			});
			for (var i = 0; i < res.length; i++){
				table.push(
				[res[i].itemID, res[i].productName, res[i].departmentName, res[i].price,  res[i].stockQuantity]);
			};
			console.log('\nHERE ARE THE UPDATED INVENTORY DETAILS : ');
			console.log(table.toString());	
		});	
		connection.end();
	});
};
var addNewProduct = function(productName, departmentName, price, quantity){
	var sqlQuery = 'INSERT INTO products (productName, departmentName, price, stockQuantity) VALUES ("';
		sqlQuery +=  productName +'", "' + departmentName +'",' + price +', ' + quantity +');' ;
	connection.query(sqlQuery, function(err, res){
		if (err) throw err;
		getAllProducts();
		connection.end();
	});
};
//get response from the customer
var promptCustomer = function(choice){
	if (choice == "Add to Inventory"){
		inquirer.prompt([
			{
				type: 'input',
				name:'productID',
				message:'Please enter the product ID? [Quit with Q]'
			},
			{	
				type: 'input',
				name:'quantity',
				message:'How many more do you want  to add? [Quit with Q]'	
			}

		]).then(function(val){
			if (isNaN(val.productID) || isNaN(val.quantity) ){ 
				if (isNaN(val.productID)) {
					console.log(val.productID);
					// Pass the return value in the done callback
					console.log('You need to provide a valid productID');
				};
				if (isNaN(val.quantity)) {			
					console.log('You need to provide a number');
				}
				promptCustomer("Add to Inventory");
			} else {
				addInventory(val.productID, val.quantity);
				return;
			};
		});
	} else if (choice == "Add New Product") {
		inquirer.prompt([
			{
				type: 'input',
				name:'productName',
				message:'Please enter the product Name? [Quit with ctrl+C]'
			},
			{
				type: 'input',
				name:'departmentName',
				message:'Please enter the Department Name? [Quit with ctrl+C]'
			},
			{
				type: 'input',
				name:'price',
				message:'Please enter the Price? [Quit with ctrl+C]'
			},
			{	
				type: 'input',
				name:'quantity',
				message:'How many more do you want  to add? [Quit with Q]'	
			}

		]).then(function(val){
			if (isNaN(val.price) || isNaN(val.quantity) ){ 
				if (isNaN(val.price)) {
					console.log(val.price);
					// Pass the return value in the done callback
					console.log('You need to provide a valid price');
				};
				if (isNaN(val.quantity)) {			
					console.log('You need to provide a number');
				}
				promptCustomer("Add New Product");
			} else {
				addNewProduct(val.productName, val.departmentName, val.price, val.quantity);
				return;
			};
		});
	};
};
