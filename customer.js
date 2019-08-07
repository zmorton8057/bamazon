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

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);

    table()

})

/////////cli-table design for displaying the inventory
function table() {

    // instantiate
    var table = new Table({
        head: ['ID', 'Item', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30]
    });

    displayInventory();
    ////////// retrieves inventory from mySQL with a query
    function displayInventory() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                var itemID = res[i].id,
                    productName = res[i].product_name,
                    price = `$${res[i].price}`,
                    quantity = res[i].quantity;

                table.push(
                    [itemID, productName, price, quantity]
                );
            }
            console.log("========================================= Welcome to Bamazon ===========================================")
            console.log("============================================= Inventory ================================================")
            console.log(table.toString());
        });
    }
    }