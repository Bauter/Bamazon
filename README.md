# Bamazon
A node cli app of an amazon-like storefront, utilizing MySQL to handle data.

Bamazon has 3 JS files to run with Node.js, each providing a different set of functions.

## What you will need 

-explanations to follow

1. A code editor, I prefer Visual Studio Code ("https://code.visualstudio.com/").
2. Node.js to run node commands in terminal ("https://nodejs.org/en/download/").
3. '.gitignore' file to write what files you would not like to upload. 
4. NPM packages: 'inquirer', 'mysql', 'chalk'.
5. MySQL downloaded (you will need MySQL workbench) ("https://www.mysql.com/downloads/").


## Lets get set up!

1. Create a project folder (to save time you can clone this repository and skip the steps you don't need.)
    -Create files named:
    - 'bamazonCustomer.js'
    - 'bamazonManager.js'
    - 'bamazonSupervisor.js'
    - '.gitignore'
    - 'bamazonSeeds.sql'

2. In the root of your project folder in terminal and run "npm init -y". This will initialize a "package.json" file for your project. (this is required to install npm packages).

3. Inside your '.gitignore' file add the following line. (this will prevent git from uploading these files).
```
node_modules
```
4. Inside terminal once again Install all  relevant NPM packages via the following command:
`$ npm i inquirer`

`$ npm i mysql`

`$ npm i chalk`

