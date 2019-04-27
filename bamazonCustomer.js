var inquirer = require('inquirer')
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect((err)=>{
  if (err) throw error
  runBamazon();
})

function runBamazon(){
  inquirer
    .prompt([{
      name: 'userChoice',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['Shop', 'Manager View']
    }])
    .then((answers)=>{
      switch (answers.userChoice){
        case 'Shop':
          displayProducts('shop')
          break;
        case 'Manager View':
          loadManager()
          break;
        case 'Supervisor View':
          loadSupervisor()
          break;
        default:
          console.log(`>> Something went wrong... restarting.`)
          runBamazon()
      }
    })
}

function displayProducts(option){
  connection.query("SELECT * FROM PRODUCTS ORDER BY DEPARTMENT_NAME", (err, res)=>{
    if (err) throw err
    console.log(`\n`)
    console.table(res)
    if(option === 'shop'){
      loadShop()
    } else if (option === 'manager') {
      loadManager()
    }
  })
}

function loadManager(){
  inquirer
    .prompt([{
      name: 'userChoice',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Main Menu']
    }])
    .then((answer)=>{
      switch(answer.userChoice){
        case 'View Products for Sale':
          displayProducts('manager')
          break;
        case 'View Low Inventory':
          connection.query("SELECT * FROM PRODUCTS WHERE STOCK_QUANTITY < 5", (err, res)=>{
            if(err) throw err
            console.table(res)
            loadManager()
          })
          break;
        case 'Add to Inventory':
          addInventory()
          break;
        case 'Add New Product':
          addNewProduct()
          break;
        case 'Main Menu':
          runBamazon()
          break;
        default:
          console.log(">> Something went wrong... your choice somehow isn't valid.")
        }
    })
}

function addInventory(){
  inquirer
    .prompt([{
      name: 'itemID',
      type: 'number',
      message: 'Update which item? (by Item ID)'
    },{
      name: 'quantity',
      type: 'number',
      message: 'How many would you like to add?'
    }])
    .then((answers)=>{
      connection.query('SELECT STOCK_QUANTITY FROM PRODUCTS WHERE ITEM_ID = ?', answers.itemID, (err,res)=>{
        connection.query(
          'UPDATE PRODUCTS SET STOCK_QUANTITY = ? WHERE ITEM_ID = ?;',
          [res[0].STOCK_QUANTITY + answers.quantity, answers.itemID],
          (err, res)=>{
            if (err) throw err
            console.log(`>> Item added to Inventory`)
            loadManager()
          }
        )
      })
    })
}

function addNewProduct(){
  inquirer
    .prompt([{
      name: 'itemName',
      type: 'input',
      message: 'What is the new items name?'
    },{
      name: 'department',
      type: 'list',
      message: 'What department does this belong to?',
      choices: ['Books & Audible', 'Clothing, Shoes, Jewelry & Watches', 'Electronics, Computers & Office', 'Food & Grocery', 'Home, Garden & Tools', 'Movies, Music & Games']
    },{
      name: 'price',
      type: 'number',
      message: 'What is the sale price?',
    },{
      name: 'quantity',
      type: 'number',
      message: 'How many are available to sell?'
    }])
    .then((answers)=>{
      connection.query(
        'INSERT INTO PRODUCTS (PRODUCT_NAME, DEPARTMENT_NAME, PRICE, STOCK_QUANTITY) VALUE(?, ?, ?, ?);',
        [answers.itemName, answers.department, answers.price, answers.quantity],
        (err, res)=>{
          if (err) throw err
          console.log(`>> Item added to Inventory`)
          loadManager()
        }
      )
    })
}

function loadShop(){
  inquirer
    .prompt([{
      name: 'itemID',
      type: 'number',
      message: 'What item would you like to buy? (enter ITEM_ID)'
    },{
      name: 'amount',
      type: 'number',
      message: 'How many would you like to purchase?'
    }])
    .then((answers)=>{
      connection.query('SELECT STOCK_QUANTITY FROM PRODUCTS WHERE ITEM_ID = ?', answers.itemID, (err,res)=>{
        if(res[0].STOCK_QUANTITY >= answers.amount) {
          connection.query('UPDATE PRODUCTS SET STOCK_QUANTITY = ? WHERE ITEM_ID = ?', [res[0].STOCK_QUANTITY - answers.amount, answers.itemID], (err,res)=>{
            if (err) throw err
            connection.query('SELECT PRICE FROM PRODUCTS WHERE ITEM_ID = ?', answers.itemID, (err,res)=>{
              console.log(`Total cost for purchase: ${res[0].PRICE * answers.amount}`)
              inquirer
                .prompt([{
                  name: 'userChoice',
                  type: 'list',
                  message: 'Would you like to continue shopping or return to the main menu?',
                  choices: [
                    'Continue',
                    'Main Menu'
                  ]
                }])
                .then((answers)=>{
                  switch(answers.userChoice){
                    case 'Continue':
                      displayProducts('shop')
                      break;
                    case 'Main Menu':
                      runBamazon()
                      break;
                    default:
                      console.log(`>> Something went wrong... returning to main menu`)
                      runBamazon()
                  }
                })
            })
          })
        } else {
          console.log('Insufficient inventory quantity')
          loadShop()
        }
      })
    })
}

// function runBamazon() {
//   inquirer
//     .prompt({
//       name: "action",
//       type: "list",
//       message: "What would you like to do?",
//       choices: [
//         "Find songs by artist",
//         "Find all artists who appear more than once",
//         "Find data within a specific range",
//         "Search for a specific song",
//         "exit"
//       ]
//     })
//     .then(function(answer) {
//       switch (answer.action) {
//       case "Find songs by artist":
//         artistSearch();
//         break;
//
//       case "Find all artists who appear more than once":
//         multiSearch();
//         break;
//
//       case "Find data within a specific range":
//         rangeSearch();
//         break;
//
//       case "Search for a specific song":
//         songSearch();
//         break;
//
//       case "exit":
//         connection.end();
//         break;
//       }
//     });
// }
