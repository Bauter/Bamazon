// NPM packages
const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require('chalk');

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
    menu();
});

// A function to create a menu
function menu() {
    inquirer.prompt([
        {
            type:"list",
            name:"menu-options",
            message:"Please select one of the following commands:",
            choices:[chalk.green.bold("View Product Sales by Department"), chalk.yellow.bold("Create New Department"), chalk.red.bold("Exit")]
        }
    ]).then(function(response) {
      // Assign the response to a variable.
      let command = response["menu-options"];
      runCommand(command);
      
      //connection.end();

    });
};// END OF menu function

// A function to execute the command from menu.
function runCommand(commandInput) {
    
    switch (commandInput) {
        case chalk.green.bold("View Product Sales by Department"):
            // do something (call function here)
            showDepartments();
            break;

        case chalk.yellow.bold("Create New Department"):
            // do something (call function here)
            addDepartment();
            break;

        case chalk.red.bold("Exit"):
            connection.end();
            process.exit;
            break;

        default:
            break;
    };

}; // END OF runCommand function

// A function to show departments and join with 'products.product_sales' and display 'total_costs' column by displaying the sum of two tables.
function showDepartments() {
    console.log(chalk.blue.bold("Departments overview:") + chalk.red.dim("<Supervisor>"));
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, (products.product_sales - departments.over_head_costs) AS total_profit FROM departments, products WHERE departments.department_name = products.department_name", function(err, res) {
      if (err) throw err;
      console.table(res);
      returnTo();
    });
}; // END OF showDepartments function

// A function to add a department
function addDepartment() {
    console.log(chalk.blue.bold("Lets add a department:") + chalk.red.dim("<Supervisor>"));

    inquirer.prompt([
        {
            type:"input",
            name:"dptName",
            message:"What is the name of the department you would like to add? ",
            validate: function(value) {
                if (value == "") {
                    return "Please enter a department name"
        
                } else {
                    return true
                }
             }
        },
        {
            type:"input",
            name:"overHead",
            message:"What are the over-head costs for this new department?",
            validate: function(value) {
                if (value == "") {
                    return "Please enter a number"
        
                } else {
                    return true
                }
             }
        }
    ]).then(function(response) {
        let departmentName = response.dptName;
        let overHeadCost = response.overHead;

        connection.query("INSERT INTO departments SET?",
        {
           department_name: departmentName,
           over_head_costs: overHeadCost
        },
        function(err, res) {
        if (err) throw err;
        
        console.log(res.affectedRows + chalk.blue("department added!"));
        returnTo();
        })

    });

} // END OF addDepartment function

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
            console.log(chalk.blue("\n\nGoodbye\n\n"));
            connection.end();
        }
    }) 
}