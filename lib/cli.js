//Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { Department } = require('./department');
class CLI {
    constructor() {
        // Connect to database
        this.db = mysql.createConnection(
            {
                host: 'localhost',
                // MySQL username,
                user: 'root',
                // MySQL password 
                password: 'sql123',
                database: 'employees_db'
            },
        );
    }
    // This function creates the prompt interface
    run() {
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'task',
                    message: 'What would you like to do?',

                    choices: [
                        { name: 'View all employees' },
                        { name: 'Add an employee' },
                        { name: 'Update an employee role' },
                        { name: 'View all departments' },
                        { name: 'Add a department' },
                        { name: 'View all roles' },
                        { name: 'Add a role' },
                    ]
                },
            ])
            .then(({ task }) => {
                switch (task) {
                    case 'Add a role':

                        break;
                    case 'View all roles':

                        break;
                    case 'Add a department':
                        this.addDepartment();
                        break;
                    case 'View all departments':
                        this.viewDepartment();
                        break;
                    case 'Add an employee':

                        break;
                    case 'View all employees':

                        break;
                    case 'Update an employee role':

                        break;
                    default: break;
                }
            })
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
    }
    addDepartment() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'What is the name of the department ?',
                },
            ])
            .then(({ department }) => {
                const dep = new Department(this.db);
                return dep.addDepartment(department);

            })
            .then(() => this.run())
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
    }
    viewDepartment() {
        const dep = new Department(this.db);
        dep.getAllDepartments()
            .then(() => this.run());
    }
}

module.exports = CLI;
