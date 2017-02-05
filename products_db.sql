-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect bamazon_db --
USE bamazon_db;

-- Creates the table "products" within bamazon_db --
CREATE TABLE products (
  -- Creates a numeric column called "item_id" which will automatically increment its default value as we create new rows --
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "product_name" which cannot contain null --
  product_name VARCHAR(30) NOT NULL,
  -- Makes a sting column called "department_name" --
  department_name VARCHAR(30) NOT NULL,
  -- Makes an numeric column called "price" --
  price DECIMAL(7,2) NOT NULL,
  -- Makes an numeric column called "stock_quantity"
  stock_quantity INTEGER(10) NOT NULL,
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PROD1", "DEPT1", 30.00, 10)
, ("PROD2", "DEPT2", 40.00, 11)
, ("PROD3", "DEPT3", 50.00, 12)
, ("PROD4", "DEPT4", 60.00, 13)
, ("PROD5", "DEPT5", 70.00, 14)
, ("PROD6", "DEPT6", 80.00, 15)
, ("PROD7", "DEPT7", 90.00, 16)
, ("PROD8", "DEPT8", 100.00, 17)
, ("PROD9", "DEPT9", 110.00, 18)
, ("PROD10", "DEPT10", 120.00, 19);


-- checking to see if the data got inserted into the table --
SELECT * FROM products;

