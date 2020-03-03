CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nitro 5 laptop", "electronics", 699.99, 5),
("Kingston SSD-500gb", "electronics", 60.99, 10),
("LG Ultrawide monitor-34", "electronics", 249.99, 3),
("Huggies Dipers size-3 (136ct)", "Babies/toddlers", 45.99, 20),
("Unicorn sleeper (6-9 months)", "Babies/toddlers", 4.99, 15),
("Bright Stars playmat", "Babies/toddlers", 15.99, 5),
("Nerf Ultra 2", "Toys", 23.99, 10),
("Nerf Ultra Darts (100ct)", "Toys", 19.99, 10),
("Snow Pants (small 6-7)", "Boy's clothing", 15.00, 8),
("Minecraft Winter Hat", "Boy's clothing", 9.99, 10),
("Winter Gloves", "Boy's clothing", 12.99, 3)


CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs INTEGER(10),
    PRIMARY KEY (department_id)
);

INSERT INTO departments ()
VALUES