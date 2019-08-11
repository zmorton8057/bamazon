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



//////////////////////////////////////// Main Menu ////////////////////////////////////////////////
function menu () {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "======================================= Bamazon Manager Portal =========================================",
                choices: [
                    "View Product Sales",
                    "Create New Department",
                    "Log Out"
                ]
            },    
        ])
        .then(function(answer) {

            if (answer.menu === "View Product Sales"){
                table();
            } else if (answer.menu === "Create New Department") {
                console.log("Creating New Department")
            } else if (answer.menu === "Log Out") {
                logOut();
            }
        })
}


/////////////////////////////////  INVENTORY ////////////////////////////////////////////////
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




















///////////////////// Log Out Function /////////////////////////
function logOut() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "logOut",
                message: "Do you wish to remain in Supervisor Portal?",
            }    
        ])
        .then(function(answer) {
           
            if (answer.logOut) {
                menu();
            } else {
                console.log('================================== You Have Logged Off ==================================')
                connection.end()
            }
           
        })
        
}