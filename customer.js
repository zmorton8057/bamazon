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
    table()

})

/////////cli-table design for displaying the inventory
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
            console.log("========================================= Welcome to Bamazon ===========================================")
            console.log("============================================= Inventory ================================================")
            console.log(table.toString());
            ////////// runs inquirer prompt after the inventory is displayed
            selectionMake();
        });
    }
}

var selectionMake = function() {
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
            connection.query("SELECT * FROM products WHERE id=?", userPurchase.itemID, function(err, res) {
                for (var i = 0; i < res.length; i++) {

                    var newInventoryQuantity = res[i].quantity - userPurchase.userQuantity;
                        console.log(newInventoryQuantity)
                    var userSelect = userPurchase.itemID;
                        userSelect = parseInt(userSelect)
                    
                    if (userPurchase.userQuantity > res[i].quantity) {
                        table()
                        console.log("================================== Insufficient Quantity Available ==================================")
                        console.log(`The item "${res[i].product_name}" only has ${res[i].quantity} in stock.`)
                        console.log(`You tried to order a quantity of ${userPurchase.userQuantity}`)

                    } else {

                        console.log("============================================ Item Selected ==============================================")
                        console.log(`ID: ${res[i].id}`)
                        console.log(`Item: ${res[i].product_name}`)
                        console.log(`Price: $${res[i].price}`)
                        console.log(`Quantity: ${userPurchase.userQuantity}`)
                        console.log('----------------------------')
                        var total = parseInt(res[i].price) * parseInt(userPurchase.userQuantity)
                        console.log(`Total: $${total}`)
                        confirmPrompt(newInventoryQuantity, userSelect)
                    } 
                } 
            }) 
        }) 
} 

function confirmPrompt(newInventoryQuantity, userSelect) {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "confirmOrder",
                message: "Please Confirm Order",
            }    
        ])
        .then(function(answer) {
            if (answer.confirmOrder === true){
            connection.query("UPDATE products SET quantity=? WHERE id=?", [newInventoryQuantity, userSelect], function(err, res){
                if(err) throw err
            console.log("=========================================== Order Confirmed ==============================================")
            continueShopping()
            
            })
        } else {
            console.log("=========================================== Order Cancelled ==============================================")
            continueShopping();
        }
        })
    }

    function continueShopping() {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "confirmShopping",
                    message: "Do you wish to continue shopping?",
                }    
            ])
            .then(function(answer) {
               
                if (answer.confirmShopping) {
                    table();
                } else {
                    console.log('================================== Thanks for Choosing Bamazon ==================================')
                    connection.end()
                }
               
            })
            
    }

