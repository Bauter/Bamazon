// NPM packages
const inquirer = require("inquirer");
const mysql = require("mysql");

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
  console.log("Here's whats for sale");
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
        shoppingCart.push(" " + numOf + " - " + itemsArray[i].product_name);
        if (numOf <= itemsArray[i].stock_quantity) {
          //console.log("ok, ordering " + numOf + " " + itemsArray[i].product_name )
          quantityLeft = itemsArray[i].stock_quantity - numOf
          total = itemsArray[i].price * numOf
          shoppingCartTotal.push(total);
          //update(numOf);
        } else {
          console.log("Sorry, quantity of that item is limited.")
        };
      };
        
      
    }; // end of for loop

    console.log("Shopping cart: " + shoppingCart);
    console.log("total for this order: " + total);
    console.log("total for all items in shopping cart: " + shoppingCartTotal.reduce(addEmUp));

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
      console.log("\nThanks for shopping with us!\n")
      console.log("Today you purchased: " + shoppingCart);
      console.log("The total for these purchases: " + shoppingCartTotal.reduce(addEmUp));
      console.log("Come back soon!");
      connection.end();
    }

  });
}; // END OF keepShopping function

// Update MySQL database
function update(itemID, quantityLeft) {
  console.log("Updating quantities...\n");
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
      console.log(res.affectedRows + " products updated!\n");
      keepShopping();
    }
  );
}; // END OF update function

function addEmUp (total, num) {
  return total + num;
}