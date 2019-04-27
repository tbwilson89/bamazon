# Node.js & MySQL Bamazon App (Amazon Clone)

## Overview

An Amazon clone made in Node.js and using a MySQL database to create, read and update an inventory system. Initial startup of the program gives the user the option to either shop or execute manager actions.

![Initial Screen](/images/startup.PNG)

### Shopping

![Shopping Screen](/images/itempurchase.PNG)

The first function of the app is to be able to look at current inventory and purchase from stock, the app will refuse to allow you to purchase a quantity beyond what is in stock.

If you make a successful purchase action, the app will display the total cost of the item(s) you purchased and update the database. After this it will ask if you would like to continue shopping or return to the main menu.

### Manager Screen

![Manager Screen](/images/ManagerActions.PNG)

The second function is the managers view, where a user can check the current status of all inventory, check what inventory is currently below 5 stock quantity, update the quantity of any inventory within the database as well as add new items to the database.
