CREATE DATABASE bamazondb;
USE  bamazondb;
SELECT * FROM products;
DROP TABLE products;

CREATE TABLE products(
 `itemID` INT AUTO_INCREMENT NOT NULL,
  `productName` VARCHAR(100) NULL,
  `departmentName` VARCHAR(100) NULL,
  `price` DOUBLE(10,2) NULL,
  `stockQuantity` INT NULL,
  PRIMARY KEY (`itemID`)
);
select * from products;
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product1', 'department1', 20.50, 10);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product2', 'department1', 25.50, 20);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product1', 'department2', 30.50, 10);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product2', 'department2', 35.50, 30);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product1', 'department3', 120.50, 30);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product2', 'department3', 125.50, 50);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product1', 'department4', 310.50, 1);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product2', 'department4', 315.50, 3);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product1', 'department5', 20.50, 10);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product2', 'department5', 25.50, 90);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product1', 'department6', 301.50, 100);
INSERT INTO  products(`productName`, `departmentName`, `price`, `stockQuantity`) VALUES (
'product2', 'department6', 351.50, 10);

CREATE TABLE departments(
 `departmentID` INT AUTO_INCREMENT NOT NULL,
  `departmentName` VARCHAR(100) NULL,
  `overHeadCosts` DOUBLE(10,2) NULL,
  `totalSales` DOUBLE(10,2) NULL,
  PRIMARY KEY (`departmentID`)
);
select * from departments;
INSERT INTO  departments(`departmentName`, `overHeadCosts`, `totalSales`) VALUES (
'department1', 30000, 100000);
INSERT INTO  departments(`departmentName`, `overHeadCosts`, `totalSales`) VALUES (
'department2', 20000, 10000);
INSERT INTO  departments(`departmentName`, `overHeadCosts`, `totalSales`) VALUES (
'department3', 10000, 122000);
INSERT INTO  departments(`departmentName`, `overHeadCosts`, `totalSales`) VALUES (
'department4', 1000, 12000);


UPDATE departments dep
JOIN products pro ON pro.departmentName=dep.departmentName AND pro.itemID = 1
SET dep.totalSales =  (dep.totalSales + 10*pro.price) ;


