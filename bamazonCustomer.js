// requiring all the needed packages as well as key.js file which contains my mysql password
var mysql = require("mysql");
var inquirer = require("inquirer");
var key = require("./key.js");

// creating connection object with all the required properties
var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,
	// username
	user: "root",
	// password
	password: key.myPassword.sql_password,
	// my database
	database: "bamazon_db"
});


// checking to see if the connection is successful
connection.connect(function(err){
	if (err){
		throw err;
	}
	console.log("connected as id " + connection.threadId);
});


// logging in all the products available in the inventory for the customer to see
connection.query("SELECT * FROM products", function(err, res){
	console.log("item_id |  product_name  |  price  |  quantity");
	for (var i = 0; i < res.length; i++){
		console.log(res[i].item_id + "    |    " + res[i].product_name+ "    |    " + res[i].price + "     |    " + res[i].stock_quantity);
	}
	console.log("-----------------------------------");
	start();
});


// function to prompt questions to user and update the database eventually
var start = function(){
	inquirer.prompt([{

		name: "id",
		type: "input",
		message: "Please input ITEM_ID of the product you would like to buy?",
		// function to validate that the user is inputtinf a number and not a character, if user inputs a character the response doe not go through 
		validate: function(value) {
		if (isNaN(value) === false){
			return true;
		}
				return false;
		}

		},
		
		{
		name: "quantity",
		type: "input",
		message: "What quantity of the item would you like to buy?",
		// function to validate that the user is inputtinf a number and not a character, if user inputs a character the response doe not go through 
		validate: function(value) {
		if (isNaN(value) === false){
			return true;
		}
				return false;
		}

	}]).then(function(answer) {
		console.log(JSON.stringify(answer, null, 2));
		// function to check if the stock carries that item and if the quantity if enough
		checkStock(answer.id, answer.quantity);

	}); // end .then function of prompt
}; // end start


//function to check if the stock carries that item and if the quantity if enough 
 function checkStock(id, quant){
 	var query = "SELECT * FROM products WHERE ?"
 	connection.query(query, {item_id: id}, function(err, res){
 		if (err) throw err;

 		// logging in available quantity
 		console.log("Quantity available in our stock is: " + res[0].stock_quantity);

 		//created a variable to deduct item quantity from available stock
 		var updatedQuantity = res[0].stock_quantity - parseInt(quant);

 		
 		//if the stock quantity is more than what the buyer needs to buy, run update stock function and also tell the user what quantity they purchsed and how much did it cost them
 		if (res[0].stock_quantity > parseInt(quant)) {
 			updateStock(id, updatedQuantity);
 			console.log("You purchased " + quant + " quantity of " + res[0].product_name);
 			console.log("Your total is: " + res[0].price * quant);
 		}
 		// let the user know if what user ordered is what we have in inventory currently
 		else if (res[0].stock_quantity === parseInt(quant)) {
 			updateStock(id, updatedQuantity);
 			console.log("Lucky you, We have only " + quant + " quanity left of " + res[0].product_name);
 			console.log("Your total is: " + res[0].price * quant);
 		}
 		//if the qunatity ordered by user is more, suggest them to buy the avaialble quantity
 		else if (res[0].stock_quantity < parseInt(quant)){
 			console.log("Insufficient quantity! We only have " + res[0].stock_quantity + " of " + res[0].product_name);
 			connection.end();
 		}

 	})
 }

//updating bamazon database
 function updateStock(id, quant){
 	var query = "UPDATE products SET ? where ?"
 	connection.query(query, [{stock_quantity: quant}, {item_id: id}], function(err, res){
 	});
	};

