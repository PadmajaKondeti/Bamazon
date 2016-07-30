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
	getAllProducts();	
});
var getAllProducts = function(){
	var sqlQuery = "SELECT * FROM products";
	connection.query(sqlQuery, function(err, res){
		if ( res.length ) {
			var table = new Table({
				head: ['ItemID', 'ProductName', 'Price', 'AvailableQty'],
				colWidths: [10, 15, 15, 15]
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
		message:'What would you like to purchase? [Quit with ctrl+C]'
		
	},
	{	type: 'input',
		name:'quantity',
		message:'How many do you like to purchase? [Quit with ctrl+C]'	
	}

	]).then(function(val){
		if (isNaN(val.choice) || isNaN(val.quantity) ){
			 
			if (isNaN(val.choice)) {
				console.log(val.choice);
				// Pass the return value in the done callback
				console.log('You need to provide a valid productID');
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
// displaying data by accepting product Id and quantity from the user
var getProdctDetails = function(productID, quantity){
	var sqlQuery = 'SELECT * FROM Products WHERE ItemID= '+ productID ;
	connection.query(sqlQuery, function(err, res){
		if (err) throw err;
		if ( res.length ) {
			if (res[0].stockQuantity  >= quantity){
				// updated quantity in the products
				var sqlQuery = 'UPDATE products SET stockQuantity = stockQuantity - ' + quantity + ' WHERE ItemID = ' + productID + ';';
				connection.query(sqlQuery, function(err, res){
					if (err) throw err;
					// display total cost to customer
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
						//updating department table total sales
						var sqlQuery = 'UPDATE departments dep JOIN products pro ON pro.departmentName=dep.departmentName AND pro.itemID = '
							+ productID +' SET dep.totalSales =  (dep.totalSales + ' +  quantity + ' * pro.price);'; 
						connection.query(sqlQuery, function(err, res){
							if (err) throw err;
						});
						connection.end();
					});	
				})
			} else {
				console.log("Sorry Insufficient quantity");
				connection.end();
			};
		}
	});
};