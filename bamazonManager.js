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
				break;
			case  ("View Low Inventory"):
				console.log("View Low Inventory");
				getLowInventory();
				break;
			case  ("Add to Inventory"):
				console.log("Add to Inventory");
				break;
			case  ("Add New Product"):
				console.log("Add New Product");
				break;
			default:
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
				head: ['ItemID', 'ProductName', 'Price'],
				colWidths: [10, 20, 20]
			});
			for (var i = 0; i < res.length; i++){
				table.push(
				[res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity]);
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
				head: ['ItemID', 'ProductName', 'Price'],
				colWidths: [10, 20, 20]
			});
			for (var i = 0; i < res.length; i++){
				table.push(
				[res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity]);
			};
			console.log(table.toString());	
		};	
	});
};
var addInventory = function(){
	var sqlQuery = "SELECT * FROM products WHERE stockQuantity < 5";
	connection.query(sqlQuery, function(err, res){
		if ( res.length ) {
			var table = new Table({
				head: ['ItemID', 'ProductName', 'Price'],
				colWidths: [10, 20, 20]
			});
			for (var i = 0; i < res.length; i++){
				table.push(
				[res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity]);
			};
			console.log(table.toString());	
			promptCustomer();
		};	
	});
};



//get response from the customer
var promptCustomer = function(){
	inquirer.prompt([
	{
		type: 'input',
		name:'choice',
		message:'Please enter the product ID? [Quit with Q]'
		
	},
	{	type: 'input',
		name:'quantity',
		message:'How many more do you want  to add? [Quit with Q]'	
	}

	]).then(function(val){
		if (isNaN(val.choice) || isNaN(val.quantity) ){
			 
			if (isNaN(val.choice)) {
				console.log(val.choice);
				// Pass the return value in the done callback
				console.log('You need to provide a number');
			};
			if (isNaN(val.quantity)) {			
				console.log('You need to provide a number');
			}
			promptCustomer();
		} else {
			getProdctDetails(val.choice, val.quantity);
			return;
		}
	});
}
;// displaying data by accepting product Id and quantity from the user
var getProdctDetails = function(productID, quantity){
	var sqlQuery = 'SELECT * FROM Products WHERE ItemID= '+ productID ;
	connection.query(sqlQuery, function(err, res){
		if (err) throw err;
		if ( res.length ) {
			if (res[0].stockQuantity  >= quantity){
				var sqlQuery = 'UPDATE products SET stockQuantity = stockQuantity - ' + quantity + ' WHERE ItemID = ' + productID ;
				connection.query(sqlQuery, function(err, res){
					if (err) throw err;
					var sqlQuery = 'SELECT * FROM Products WHERE ItemID= '+ productID ;
					connection.query(sqlQuery, function(err, res){
						if (err) throw err;
						var table = new Table({
							head: ['itemID', 'productName', 'Price', 'Quantity', 'Total Ammount'],
							colWidths: [10, 20, 20, 10, 20]
						});
						for (var i = 0; i < res.length; i++){
							table.push(
							[res[i].itemID, res[i].productName, res[i].price, quantity, res[i].price * quantity	]);
						};
						console.log('\nHERE ARE THE PURCHASE DETAILS');
						console.log(table.toString());	
						connection.end();
					});	
				})
		} else {
			console.log("Sorry Insufficient quantity");
			connection.end();
		};
	}
	});
}
