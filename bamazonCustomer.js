var inquirer = require('inquirer');
var mysql    = require('mysql');
var Table = require('cli-table');
var colors = require('colors/safe');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon'
  });
  
  var started = false;

  function connect(){


    connection.connect(function(err){
        if (!err){
            process.stdout.write('\x1B[2J\x1B[0f');
            console.log("Total cost: $0.00")
            showTable();
        }
   
      });
  }

// instantiate 

// 2	Toshiba Laptop	Electronics	650.50	6
// table is an Array, so you can `push`, `unshift`, `splice` and friends 


function showTable(){
    var tab = [];
    var table = new Table({
        head: ['ID', 'Name', 'Category', 'Price', 'Quantity']
      , colWidths: [4, 25, 15, 10, 10]
     });
    connection.query("SELECT * FROM products", function (error, results, fields) {
        results.map(function(item){
            table.push([colors.green(item.item_id), item.product_name, item.department_name, item.price, item.stock_quantity])
        })
        // console.log(tab)
        // table.push(tab);
        console.log(table.toString());
        if (!started){
            start();
            // started = true;
        }
        
        
    })
}
connect();

 

  
  function searchByGenre(genre){
    connection.query("SELECT * FROM products", function (error, results, fields) {
    console.log(results)
   })
  }
  function checkAvailability(productID, cuantity){
    connection.query("SELECT stock_quantity, price  FROM products WHERE item_id = ?",[productID], function (error, results, fields) {
        if (results[0].stock_quantity >= cuantity){
            buyItems(productID, results[0].stock_quantity - cuantity, results[0].price, cuantity)
        } else {
            console.log("Insufficient quantity!")
        }
    })
  }

  function buyItems(productID, StockNewCuantity, cost, cuantity){
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[StockNewCuantity, productID], function (error, results, fields) {
        process.stdout.write('\x1B[2J\x1B[0f');
        console.log("Total cost: $" + (cuantity * cost).format(2));
        showTable()
    })
  }

//   8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//   * This means updating the SQL database to reflect the remaining quantity.
//   * Once the update goes through, show the customer the total cost of their purchase.
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


function start(){
    inquirer.prompt([
        {
            type: "input",
            name: "productID",
            message: "Product ID:",
            suffix: "(Buy)"
        },
        {
            type: "input",
            name: "cuantity",
            message: "How many units:",
            suffix: "(Buy)"
        }
    ]).then(answers => {
        // 
        checkAvailability(answers.productID, answers.cuantity);
    });
}

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.



 

//  function startApp(){
//   connection.query('SELECT * FROM songs', function (error, results, fields) {
//     results.map(function(line){
//       console.log(line.title);
//     });
//  })
// }
