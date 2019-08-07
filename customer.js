var inquirer = require('inquirer');
var mysql = require('mysql')
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);

    table()

})

/////////cli-table design for displaying the inventory
function table() {

    // Creates a table with colum titles of ID, Item, Price, and Stock
    var table = new Table({
        head: ['ID', 'Item', 'Price', 'Available Stock'],
        colWidths: [10, 30, 30, 30]
    });

    displayInventory();
    ////////// retrieves inventory from mySQL with a query
    function displayInventory() {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                ////////Assigns SQL data to variables so it can be pushed to a table for display purposes
                var itemID = res[i].id,
                    productName = res[i].product_name,
                    price = `$${res[i].price}`,
                    quantity = res[i].quantity;
                //////////Pushes sql data to Table CLI
                table.push(
                    [itemID, productName, price, quantity]
                );
            }
            console.log("========================================= Welcome to Bamazon ===========================================")
            console.log("============================================= Inventory ================================================")
            console.log(table.toString());
            selectionMake();
        });
    }
}

var selectionMake = function(){
    inquirer
        .prompt([
            {
                type: "input",
                name: "itemID",
                message: "Input the ID of Item you wish to purchase",
            },
            {
                type: "input",
                name: "userQuantity",
                message: "Input the quantity you wish to purchase",
            }/* Pass your questions in here */
        ])
        .then(function(userPurchase) {
            connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res){
                
                    })
                })
            }