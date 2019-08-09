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
    ////// Displays table callback to run after connection is established
    menu();

})



//////////////////// Main Menu ////////////////////
function menu () {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "======================================= Bamazon Manager Portal =========================================",
                choices: [
                    "Inventory",
                    "Low Inventory",
                    "Order",
                    "Add New Item"
                ]
            },    
        ])
        .then(function(answer) {

            if (answer.menu === "Inventory"){
                table()
            } else if (answer.menu === "Low Inventory") {
                tableLow()
            } else if (answer.menu === "Order") {
                console.log("Order")
            } else if (answer.menu === "Add New Item") {
                console.log("Add New Item")
            }
        })
}

function table() {

    // Creates a table with colum titles of ID, Item, Price, and Stock
    var table = new Table({
        head: ['ID', 'Item', 'Price', 'Available Stock'],
        colWidths: [10, 30, 30, 30]
    });
    ///////////// displays the inventory available to the table
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
            console.log("======================================= Welcome to Bamazon ===========================================")
            console.log("============================================= Inventory ================================================")
            console.log(table.toString());
            ////////// runs inquirer prompt after the inventory is displayed
           menu()
        });
    }
}




function tableLow() {

    // Creates a table with colum titles of ID, Item, Price, and Stock
    var table = new Table({
        head: ['ID', 'Item', 'Price', 'Available Stock'],
        colWidths: [10, 30, 30, 30]
    });
    displayLowInventory()
    ////////// retrieves inventory from mySQL with a query
    function displayLowInventory() {
        connection.query("SELECT * FROM products WHERE quantity < 6", function(err, res) {
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
            ////////// runs inquirer prompt after the inventory is displayed
           menu()
        });
    }
}