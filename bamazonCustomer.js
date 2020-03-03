// NPM packages
const inquirer = require("inquirer");
const mysql = require("mysql");

// Settign up mysql connection 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "bauter",

  // Your password
  password: "raspberry3.14",
  database: "bamazon_db"
});

// mysql connection function
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showItems();
});

function showItems() {
  console.log("Here's whats for sale");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
  })
}