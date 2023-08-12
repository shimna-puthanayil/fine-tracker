//Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { Department } = require('./department');
const { Role } = require('./role');
const { Employee } = require('./employee');
var hide = require('hide-secrets')



class CLI {
    constructor() {
        // Connect to database
        var obj = {
            // innerObject: {
            host: 'localhost',
            // MySQL username,
            user: 'root',
            // MySQL password 
            password: 'sql123',
            database: 'employees_db'
            // },
            // auth: '' // empty strings are left empty.
        }
        hide(obj);
        this.db = mysql.createConnection(obj);
        // console.log(con);
        // this.db = mysql.createConnection(
        //     {
        //         host: 'localhost',
        //         // MySQL username,
        //         user: 'root',
        //         // MySQL password 
        //         password: 'sql123',
        //         database: 'employees_db'
        //     },
        // );
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
                        { name: 'Exit' },
                    ]
                },
            ])
            .then(({ task }) => {
                switch (task) {
                    case 'Add a role':
                        this.addRole();
                        break;
                    case 'View all roles':
                        this.viewRole();
                        break;
                    case 'Add a department':
                        this.addDepartment();
                        break;
                    case 'View all departments':
                        this.viewDepartment();
                        break;
                    case 'Add an employee':
                        this.AddEmployee();
                        break;
                    case 'View all employees':
                        this.viewEmployee();
                        break;
                    case 'Update an employee role':
                        this.updateEmployeeRole();
                        break;
                    case 'Exit':
                        process.exit();
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
    addRole() {
        let departments = [];
        const dep = new Department(this.db);
        const db = this.db;
        dep.getDepartments().then(function (rows) {
            departments = rows;
            return inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'What is the name of the role ?',
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role ?',
                    },
                    {
                        type: 'list',
                        name: 'id',
                        message: 'Which department does the role belong to ?',
                        choices: departments,

                    },
                ])
                .then(({ title, salary, id }) => {
                    const role = new Role(db);
                    const roleDetails = {
                        title: title,
                        salary: salary,
                        departmentId: id,
                    };
                    return role.addRole(roleDetails);
                });

        })
            .then(() => this.run())
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
    }
    viewRole() {
        const role = new Role(this.db);
        role.getAllRoles()
            .then(() => this.run());
    }
    AddEmployee() {
        const role = new Role(this.db);
        const db = this.db;
        role.getRoles().then(function (rows) {
            let roles = rows;
            const employee = new Employee(db);
            return employee.getManagers().then(function (rows) {
                let managers = rows;
                return inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: `What is the employees' s first name ?`,
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: `What is the employees' s last name ?`,
                        },
                        {
                            type: 'list',
                            name: 'roleId',
                            message: `What is the employees' s role ?`,
                            choices: roles,
                        },
                        {
                            type: 'list',
                            name: 'managerId',
                            message: `Who is the employees' s manager ?`,
                            choices: managers,
                        },
                    ])
                    .then(({ firstName, lastName, roleId, managerId }) => {
                        const employee = new Employee(db);
                        const employeeDetails = {
                            firstName: firstName,
                            lastName: lastName,
                            roleId: roleId,
                            managerId: managerId,
                        };

                        return employee.addEmployee(employeeDetails);
                    });
            });
        })
            .then(() => this.run())
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
    }
    viewEmployee() {
        const employee = new Employee(this.db);
        employee.getAllEmployees()
            .then(() => this.run());
    }
    updateEmployeeRole() {
        const role = new Role(this.db);
        const db = this.db;
        role.getRoles().then(function (rows) {
            let roles = rows;
            const employee = new Employee(db);
            return employee.getEmployeeNames().then(function (rows) {
                let employees = rows;
                return inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employeeId',
                            message: `Which  employees' s role do you want to update ?`,
                            choices: employees,
                        },

                        {
                            type: 'list',
                            name: 'roleId',
                            message: `Which role do you want to assign the selected employee?`,
                            choices: roles,
                        },
                    ])
                    .then(({ employeeId, roleId }) => {
                        const employee = new Employee(db);
                        const employeeDetails = {

                            roleId: roleId,
                            employeeId: employeeId,
                        };

                        return employee.updateEmployee(employeeDetails);
                    });
            });
        })
            .then(() => this.run())
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
    }
}

module.exports = CLI;
