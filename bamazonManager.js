// NPM packages
const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require('chalk');

//global variables



// Setting up mysql connection 
var connection = mysql.createConnection({
    host: "localhost",
  
    // Port
    port: 3306,
  
    // Username
    user: "bauter",
  
    // Password
    password: "raspberry3.14",
    database: "bamazon_db"
  });
  
  // mysql connection function
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //do something (call menu function)
    menu();
  });

  function menu() {
      inquirer.prompt([
          {
              type:"list",
              name:"menu-options",
              message:"Please select one of the following commands:",
              choices:[chalk.green.bold("View Products for Sale"), chalk.yellow.bold("View Low Inventory"), chalk.magenta.bold("Add to Inventory"), chalk.cyan.bold("Add New Product"), chalk.red.bold("Exit")]
          }
      ]).then(function(response) {
        // Assign the response to a variable.
        let command = response["menu-options"];
        runCommand(command);
        
        //connection.end();

      });


  } // END OF menu function

  // A function to execute the command from menu.
  function runCommand(commandInput) {
    
    switch (commandInput) {
        case chalk.green.bold("View Products for Sale"):
            // do something (call function here)
            viewForSale();
            break;

        case chalk.yellow.bold("View Low Inventory"):
            // do something (call function here)
            viewLowInv();
            break;

        case chalk.magenta.bold("Add to Inventory"):
            // do something (call function here)
            addToInv();
            break;

        case chalk.cyan.bold("Add New Product"):
            // do something (call function here)
            addNewItem();
            break;

        case chalk.red.bold("Exit"):
            connection.end();
            process.exit;
            break;

        default:
            break;
    };

  }; // END OF runCommand function

// A function to "View Products for Sale". connection is made to database
function viewForSale() {

    console.log(chalk.blue.bold("Here's whats for sale: ") + chalk.red.dim("<Manager>"));

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        // do something
        returnTo();
    });

}; // END OF viewForSale function


// A function to "View Low Inventory. connection is made to database
function viewLowInv() {
    console.log(chalk.blue.bold("These items are getting low: ") + chalk.red.dim("<Manager>"));

    connection.query("SELECT * FROM products WHERE stock_quantity <= 5",function(err, res) {
        if (err) throw err;
        console.table(res);
        // do something
        returnTo();
    });

}; // END OF viewLow function


// A function to "Add to Inventory". connection is made to database
function addToInv() {
    console.log(chalk.blue.bold("Add to inventory") + chalk.red.dim("<Manger>"));


    connection.query("SELECT item_id, product_name, stock_quantity FROM products",function(err, res) {
        if (err) throw err;

        console.table(res);
        
        inquirer.prompt([
            {
                type:"input",
                name:"id",
                message:"Which product would you like to update? (please use 'item_id')"
            },
            {
                type:"input",
                name:"num",
                message:"How many units would you like to add to stock?"
            }
        ]).then(function(response) {
            let id = response.id;
            let numToAdd = response.num;
            let itemsArray = res;
            let currentStock;
            let newStock;
            for (i = 0; i< itemsArray.length; i++) {
                if (id == itemsArray[i].item_id) {
                    currentStock = itemsArray[i].stock_quantity;
                    newStock = +numToAdd + +currentStock;
                };
                
            };
            console.log(newStock)
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newStock
                },
                {
                    item_id: id
                }
            ],
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product updated");
                returnTo();
                
            })
    
        })
    
    });

}; // END OF addToInv function


// A function to "Add New Product". connection is made to database
function addNewItem() {
    console.log(chalk.blue.bold("Add new item to inventory") + chalk.red.dim("<Manager>"));

    // run inquirer to find and store customer input
    inquirer.prompt([
        {
            type:"input",
            name:"product-name",
            message:"Please input new product name: "
        },
        {
            type:"input",
            name:"department-name",
            message:"Please input department name: "
        },
        {
            type:"input",
            name:"price",
            message:"What is the retail price per unit?: "
        },
        {
            type:"input",
            name:"quantity",
            message:"How many units would you like to add to inventory"
        }
    ]).then(function(response) {
        let productName = response["product-name"];
        let departmentName = response["department-name"];
        let price = response.price;
        let setQuantity = response.quantity;

        connection.query("INSERT INTO products SET?",
        {
           product_name: productName,
           department_name: departmentName,
           price: price,
           stock_quantity: setQuantity, 
        },
        function(err, res) {
        if (err) throw err;
        
        console.log(res.affectedRows + chalk.blue("product added!"));
        returnTo();
        })
    })

}; // END OF addNewItem

// A function to prompt the user if they would like to return to main menu or sever the connection.
function returnTo() {
    inquirer.prompt([
        {
            type:"confirm",
            name:"return",
            message:"Would you like to return to the main menu?"
        }
    ]).then(function(response) {
        if (response.return) {
            console.log(chalk.blue("returning to main menu"));
            menu()
        } else {
            console.log(chalk.blue("\n\nGoodbye"));
            connection.end();
        }
    }) 
}
