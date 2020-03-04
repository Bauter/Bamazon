// NPM packages
const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require('chalk');

//global variables
let quantityLeft;
let total;
let shoppingCart = [];
let shoppingCartTotal = [];


// Setting up mysql connection 
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
  console.log(chalk.blue.bold("Here's whats for sale:"));
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    startInquirer(res);
  });
};

// Start prompting user about purchases via inquirer
function startInquirer(res) {
  let itemsArray = res;
  inquirer.prompt([
    {
      type:"input",
      name:"itemSelect",
      message:"Please input the 'item_id' of the item you would like to purchase",
      default: 1
    },
    {
      type:"input",
      name:"itemQuantity",
      message:"How many would you like?",
      default: 1
      
    }
  ]).then(function(response) {
    
    let itemID = response.itemSelect;
    let numOf = response.itemQuantity;

    for (i=0; i< itemsArray.length; i++) {
      
      if (itemID == itemsArray[i].item_id) {
        //console.log("match found! " + itemsArray[i].product_name)
        
        if (numOf <= itemsArray[i].stock_quantity) {
          //console.log("ok, ordering " + numOf + " " + itemsArray[i].product_name )
          quantityLeft = itemsArray[i].stock_quantity - numOf
          total = itemsArray[i].price * numOf
          shoppingCart.push(" " + numOf + " - " + itemsArray[i].product_name);
          shoppingCartTotal.push(total);
          //update(numOf);
        } else {
          console.log(chalk.red("Sorry, quantity of that item is limited. lets try again..." + chalk.red.underline("this time order a bit less...")));
          return showItems();
        };
      };
        
      
    }; // end of for loop
    console.log(chalk.magenta("\n============================================\n"))
    console.log("Shopping cart: " + chalk.yellow.bold(shoppingCart));
    console.log("This adds " + chalk.green(total) + " to your order");
    console.log("total for all items in shopping cart: " + chalk.green.bold.underline(shoppingCartTotal.reduce(addEmUp)));
    console.log(chalk.magenta("\n============================================\n"))

    // update database before asking customer if they want to keep shopping
    update(itemID, quantityLeft);
  })

}; // END OF startInquirer function

// Prompt the user to see if they would like to keep shopping
function keepShopping() {
  inquirer.prompt([
    {
      type:"confirm",
      name:"confirm",
      message:"Would you like to keep shopping?"
    }
  ]).then(function(response) {
    if (response.confirm === true) {
      showItems();
    } else {
      getShipping();
    }

  });
}; // END OF keepShopping function

// Update MySQL database
function update(itemID, quantityLeft) {
  console.log(chalk.blue("\nUpdating quantities...\n"));
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: quantityLeft
      },
      {
       item_id: itemID
      }
    ], 
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + chalk.blue(" products updated!\n"));
      keepShopping();
    }
  );
}; // END OF update function

function addEmUp (total, num) {
  return total + num;
}; // END OF addEmUp function

function getShipping() {
  inquirer.prompt([
    {
      type:"input",
      name:"users-name",
      message:"What is your full name?",
      validate: function(value) {
        if (value == "") {
            return "Please enter your full name"

        } else {
            return true
        }
     }
    },
    {
      type:"input",
      name:"street-address",
      message:"What is your street address?",
      validate: function(value) {
        if (value == "") {
            return "Please enter your street address"

        } else {
            return true
        }
     }
    },
    {
      type:"input",
      name:"city",
      message:"What city do you live in?",
      validate: function(value) {
        if (value == "") {
            return "Please enter your city"

        } else {
            return true
        }
     }
    },
    {
      type:"input",
      name:"state",
      message:"What state do you live in? (initials)",
      validate: function(value) {
        if (value == "") {
            return "Please enter your state (initial)"

        } else {
            return true
        }
     }
    },
    {
      type:"input",
      name:"zip",
      message:"Please enter your zip code",
      validate: function(value) {
        if (value == "") {
            return "Please enter your zip code"

        } else {
            return true
        }
     }
    },
    {
      type:"list",
      name:"shipping",
      message:"Please select a shipping option: Overnight = $100, 2-3 days = $30, 5-6 days = $15",
      choices:[100, 30, 15],
    }
  ]).then(function(response){
    let name = response["users-name"];
    let street = response["street-address"];
    let city = response.city;
    let state = response.state;
    let zip = response.zip;
    let shipping = response.shipping;
    shoppingCartTotal.push(shipping);

    let shippingAddress = [
      "---------------------\n",
      name,
      street,
      city + ", " + state + " " + zip,
      "---------------------\n"
    ].join("\n\n")

    console.log(chalk.magenta("\n============================================\n"))
      console.log("\n" + chalk.blue.bold("Thanks for shopping with us!") + "\n")
      console.log("Today you purchased: " + chalk.yellow.bold(shoppingCart));
      console.log("The total for these purchases with shipping: " + chalk.green.bold.underline(shoppingCartTotal.reduce(addEmUp)));
      console.log(chalk.cyan("Shipping to: \n") + chalk.magenta(shippingAddress));
      console.log("\n" + chalk.blue.bold("Come back soon!"));
      console.log(chalk.magenta("\n============================================\n"))
      connection.end();

  })
}