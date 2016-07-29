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
		choices: ["View Products Sales by Department", "Create New Department"],
		name: "menu"
	}
// Once we are done with all the questions... "then" we do stuff with the answers
// In this case, we store all of the answers into a "user" object that inquirer makes for us. 
]).then(function (user) {
	// If we log that user as a JSON, we can see how it looks.
	//console.log(JSON.stringify(user, null, 2));

	// If the user confirms, we displays the user's name and pokemon from the answers. 
	connection.connect(function(err){
		if (err) throw err;
		console.log("connected as id " + connection.threadId);
		switch (user.menu){
			case  ("View Products Sales by Department"):
				console.log("View Products Sales by Department");
				viewProductSales();
				connection.end();
				break;
			case  ("Create New Department"):
				console.log("Create New Department");
				promptCustomer("Create New Department");
				// addNewDepartment();
				// connection.end();
				break;
			default:
				connection.end();
				break;
		}
	});
});
var viewProductSales = function(){
	var sqlQuery = "SELECT * FROM departments";
	connection.query(sqlQuery, function(err, res){
		if ( res.length ) {
			var table = new Table({
				head: ['DepartmentID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalSales', 'TotalProfit'],
				colWidths: [10, 20, 20, 10, 10, 10]
			});
			for (var i = 0; i < res.length; i++){
				var TotalProfit = res[i].totalSales - res[i].overHeadCosts;
				var ProductSales = 0;
				table.push(
				[res[i].departmentID, res[i].departmentName, res[i].overHeadCosts, ProductSales, res[i].totalSales, TotalProfit]);
			};
			console.log(table.toString());	
		};	
	});
};
var addNewDepartment = function(departmentName, overHeadCosts, totalSales){
	var sqlQuery = 'INSERT INTO departments (departmentName, overHeadCosts, totalSales) VALUES ("';
		sqlQuery +=  departmentName +'", ' + overHeadCosts +',' + totalSales +');' ;
		console.log(sqlQuery);
	connection.query(sqlQuery, function(err, res){
		if (err) throw err;
		viewProductSales();
		connection.end();
	});
};
//get response from the customer
var promptCustomer = function(choice){
 if (choice == "Create New Department") {
		inquirer.prompt([
			{
				type: 'input',
				name:'departmentName',
				message:'Please enter the department Name? [Quit with ctrl+C]'
			},
			{
				type: 'input',
				name:'overHeadCosts',
				message:'Please enter the overHeadCosts? [Quit with ctrl+C]'
			},
			{	
				type: 'input',
				name:'totalSales',
				message:'Please enter the totalSales? [Quit with ctrl+C]'	
			}

		]).then(function(val){
			if (isNaN(val.overHeadCosts) || isNaN(val.totalSales) ){ 
				if (isNaN(val.overHeadCosts)) {
					console.log(val.overHeadCosts);
					// Pass the return value in the done callback
					console.log('You need to provide a valid overHeadCosts');
				};
				if (isNaN(val.totalSales)) {			
					console.log('You need to provide a number');
				}
				promptCustomer("Create New Department");
			} else {
				addNewDepartment(val.departmentName, val.overHeadCosts, val.totalSales);
				return;
			};
		});
	};
};
