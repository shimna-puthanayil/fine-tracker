const CLI = require('./lib/cli.js');
//package imported to create ASCII art
var figlet = require("figlet");
//package imported for text color 
const chalk = require("chalk");
const cli = new CLI();

// function to display the title of application

function displayTitle() {
    console.log(chalk.blackBright("-------------------------------------------------------------------------------------------------------"));
    console.log(chalk.blackBright("-------------------------------------------------------------------------------------------------------"));
    console.log("  ");
    // Creates ASCII Art from text
    figlet("   EMPLOYEE  TRACKER", function (err, data) {

        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(chalk.cyan(data));
        console.log("");
        console.log(chalk.blackBright("-------------------------------------------------------------------------------------------------------"));
        console.log(chalk.blackBright("-------------------------------------------------------------------------------------------------------"));
        console.log("");
        // function to initiate the prompt
        cli.run();
    });
}
displayTitle();
