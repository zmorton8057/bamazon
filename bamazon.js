var inquirer = require('inquirer');
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

// function create connection
// within this function, do everything you need to do as the connection is alive
// close your connection

// whenever you need open the connection and do something,
// invoke this same function again

connection.connect(function (err) {

    ////// Confirms you are properly connected to database
    if (err) throw err;
    console.log('connection as id ' + connection.threadId)

    ////////Receive response from Database..... Can add additional queries using WHERE... then more with AND
    connection.query("SELECT * FROM products", function (error, response) {
        if (error) throw error;

        ///////for loop to access all of the objects within the array
        for (var i = 0; i < response.length; i++) {
            console.log(`ID: ${JSON.stringify(response[i].id)}   Product: ${JSON.stringify(response[i].product_name)}    Price: ${JSON.stringify(response[i].price)}    Quantity: ${JSON.stringify(response[i].quantity)}`);
        }

    });

    connection.end();
});



    inquirer
        .prompt([
            {
                type: "input",
                message: "Input the ID of Item you wish to purchase",
                name: "itemID"
            }
            /* Pass your questions in here */
        ])
        .then(function (response) {

            console.log(parseInt(response.itemID));
            var idArray = [];
            idArray.push(parseInt(response.itemID));

            console.log(idArray)

            function searchID(idArray) {
                connection.connect(function (err) {

                    if (err) throw err;
                    console.log('connection as id ' + connection.threadId)


                connection.query("SELECT * FROM products WHERE id =?", idArray, function (err, response) {
                    if (err) throw err;
                    console.log(response)
                })


                connection.end();
                });

            }


            searchID(idArray)



        });

