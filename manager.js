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
                    "Inventory",
                    "Low Inventory",
                    "Order",
                    "Add New Item",
                    "Log Out"
                ]
            },    
        ])
        .then(function(answer) {

            if (answer.menu === "Inventory"){
                table();
            } else if (answer.menu === "Low Inventory") {
                tableLow();
            } else if (answer.menu === "Order") {
                order();
            } else if (answer.menu === "Add New Item") {
                newItem();
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



/////////////////////////////////  LOW INVENTORY ////////////////////////////////////////////////

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

/////////////////////////////////  ORDER ////////////////////////////////////////////////
var order = function() {
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

                    var newInventoryQuantity = parseInt(res[i].quantity) + parseInt(userPurchase.userQuantity);
                        console.log(newInventoryQuantity)
                    var userSelect = userPurchase.itemID;
                        userSelect = parseInt(userSelect)
                    

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
            logOut()
            
            })
        } else {
            console.log("=========================================== Order Cancelled ==============================================")
            logOut();
        }
        })
    }

///////////////////////////// Add new item to Inventory //////////////////////////
var newItem = function() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "productName",
                message: "Input the name of the product you are adding",
            },
            {
                type: "input",
                name: "productPrice",
                message: "Input the price point of the item you wish to sell it for",
            },
            {
                type: "input",
                name: "productQuantity",
                message: "Input the initial quantity you are ordering",
            }/* Pass your questions in here */
        ])
        .then(function(mgrPurchase) {
            connection.query("INSERT INTO products (product_name, price, quantity) VALUES (?, ?, ?)", [mgrPurchase.productName, mgrPurchase.productPrice, mgrPurchase.productQuantity], function(err, res) {
                
                        var product = mgrPurchase.productName;
                        var price = mgrPurchase.productPrice;
                        var quantity = mgrPurchase.productQuantity;

                        console.log(`============================================ ${product} Was Added to Bamazon Inventory ==============================================`)
                        console.log(`Item: ${product}`)
                        console.log(`Price: $${price}`)
                        console.log(`Quantity: ${quantity}`)
                        console.log('----------------------------')
                        var total = parseInt(price) * parseInt(quantity)
                        console.log(`Total: $${total}`)
                        logOut();
                    
                
            }) 
        }) 
} 



///////////////////// Log Out Function /////////////////////////
    function logOut() {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "confirmShopping",
                    message: "Do you wish to remain in Manager Portal?",
                }    
            ])
            .then(function(answer) {
               
                if (answer.confirmShopping) {
                    table();
                } else {
                    console.log('================================== You Have Logged Off ==================================')
                    connection.end()
                }
               
            })
            
    }
