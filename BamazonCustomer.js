var mysql = require('mysql');
var inquirer = require('inquirer');
var item;
var amount;
var requests;
var price;
var remain;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Lolbball22", //Your password
    database: "bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
});

var placeOrder = function(){
	connection.query('SELECT * FROM products', function(err, res) {
	    if (err) throw err;
	    requests = res.length
	    console.log("Store Items:");
	    for (var i = 0; i < res.length; i++) {
	    	console.log(res[i].ItemID +': '+ res[i].ProductName +' $'+res[i].Price);
	    	requests--;
	    };	
	    if (requests == 0){
	    	inquirer.prompt([
			{
				type: 'input',
				message: 'What would you like to purchase?(1-10)',
				name: "itemID"
			}]).then(function(x) {
					item = x.itemID;
					inquirer.prompt([
					{
						type: 'input',
						message: 'How many would you like?',
						name: "itemAmount"
					}]).then(function(y) {
							amount = y.itemAmount;
							checkOrder();
						})
				})
	    };    
	})
};
var checkOrder = function(){
	connection.query('SELECT * FROM products WHERE ItemID=?',[item], function(err, res) {
		if(err) throw err;
		if(Number(res[0].StockQuantity) > Number(amount)){
			price = res[0].Price;
			remain = Number(res[0].StockQuantity) - Number(amount);
			checkout();
		}else {
			console.log('Not enough stock, only '+ res[0].StockQuantity + ' left of '+ res[0].ProductName);
			console.log("-----------------------------------");
			placeOrder();
		}
	});
};
var checkout = function(){
	connection.query('UPDATE products SET ? WHERE ?',[{StockQuantity: remain},{ItemID: item}], function(err,res) {
		if(err) throw err;
		else{
			console.log("Your Total is $"+ price*amount);
			console.log("------------------------------------");
		};
	});
	placeOrder();
}
placeOrder();
