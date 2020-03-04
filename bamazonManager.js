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
              choices:[chalk.green.bold("View Products for Sale"), chalk.yellow.bold("View Low Inventory"), chalk.magenta.bold("Add to Inventory"), chalk.cyan.bold("Add New Product")]
          }
      ]).then(function(response) {
        // Assign the response to a variable.
        let command = response["menu-options"];
        runCommand(command);
        console.log(command);
        //connection.end();

        



      });


  } // END OF menu function

  // A function to execute the command from menu.
  function runCommand(commandInput) {
    
    switch (commandInput) {
        case "View Products for Sale":
            // do something (call function here)
            viewForSale();
            break;

        case "View Low Inventory":
            // do something (call function here)
            viewLowInv();
            break;

        case "Add to Inventory":
            // do something (call function here)
            addToInv();
            break;

        case "Add New Product":
            // do something (call function here)
            addNewItem();
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
        connection.end();
    });

}; // END OF viewForSale function


// A function to "View Low Inventory. connection is made to database
function viewLowInv() {
    console.log(chalk.blue.bold("These items are getting low: ") + chalk.red.dim("<Manager>"));

    connection.query("SELECT * FROM products WHERE stock_quantity <= 5",function(err, res) {
        if (err) throw err;
        console.table(res);
        // do something
        connection.end();
    });

}; // END OF viewLow function


// A function to "Add to Inventory". connection is made to database
function addToInv() {
    console.log(chalk.blue.bold("Add to inventory") + chalk.red.dim("<Manger>"));

    connection.query("", function(err, res) {
        if (err) throw err;
        console.table(res);
        // do something
    })
}; // END OF addToInv function


// A function to "Add New Product". connection is made to database
function addNewItem() {
    console.log(chalk.blue.bold("Add new item to inventory") + chalk.red.dim("<Manager>"));

    connection.query("", function(err, res) {
        if (err) throw err;
        console.table();
        // do something
    })
}; // END OF addNewItem
