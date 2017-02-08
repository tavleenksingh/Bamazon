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
	start();
});


var start = function() {
  inquirer.prompt({
    name: "managerChoice",
    type: "list",
    message: "Pick one option from the following menu:",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  }).then(function(answer) {
    if (answer.managerChoice === "View Products for Sale") {
      viewProducts();
    }
    else if (answer.managerChoice === "View Low Inventory"){
      lowInventory();
    }
    else if (answer.managerChoice === "Add to Inventory"){
      addInventory();
    }
    else if (answer.managerChoice === "Add New Product"){
      newProduct();
    }
  });
};


var viewProducts = function (){
	// logging in all the products available in the inventory for the customer to see
	connection.query("SELECT * FROM products", function(err, res){
		console.log("item_id |  product_name  |  price  |  quantity");
		for (var i = 0; i < res.length; i++){
			console.log(res[i].item_id + "    |    " + res[i].product_name+ "    |    " + res[i].price + "     |    " + res[i].stock_quantity);
		}
		console.log("-----------------------------------");
		connection.end();
	});	
}; // function end

var lowInventory = function(){
	// logging in all the products available in the inventory for the customer to see
	connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5", function(err, res){
		console.log("item_id |  product_name  |  price  |  quantity");
		for (var i = 0; i < res.length; i++){
			console.log(res[i].item_id + "    |    " + res[i].product_name+ "    |    ");
		}
		console.log("-----------------------------------");
		connection.end();
	});	
}; // function end


var addInventory = function(id){
	inquirer.prompt([
			{
				type: "input",
				message: "Please enter the ID number to update quantity:",
				name: "itemID"
			},
			{
				type: "input",
				message: "Please enter the the number of items to add to inventory:",
				name: "newQuantity"
			},
			]).then(function(answer){
				connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err,res){
					var newTotal = parseInt(res[answer.itemID-1].stock_quantity)+ parseInt(answer.newQuantity);
					console.log ("New quanity of " + res[0].product_name + " is: " + newTotal);
					connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newTotal}, {item_id: answer.itemID}], function(err, res){});
					connection.end();
				});
			});
};


var newProduct = function() {
  inquirer.prompt([{
    name: "item",
    type: "input",
    message: "What is the item you would like to add?"
  }, {
    name: "department",
    type: "input",
    message: "What department would you like to place your item in?"
  }, {
    name: "price",
    type: "input",
    message: "What price should the item be?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
  }
}, {
    name: "quantity",
    type: "input",
    message: "What quantity are you adding to the inventory?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
     }

  }]).then(function(answer) {
    connection.query("INSERT INTO products SET ?", {
      product_name: answer.item,
      department_name: answer.department,
      price: answer.price,
      stock_quantity: answer.quantity
    }, function(err, res) {
      console.log("Your product was created successfully!");
      connection.end();
    });
  });
};
