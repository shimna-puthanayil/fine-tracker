//Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { Department } = require('./department');
const { Role } = require('./role');
const { Employee } = require('./employee');
var figlet = require("figlet");
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
        figlet("EMPLOYEE TRACKER", function (err, data) {

            if (err) {
                console.log("Something went wrong...");
                console.dir(err);
                return;
            }
            console.log(data);

        });
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
                        { name: 'View employees by manager' },
                        { name: 'View employees by department' },
                        { name: 'Add an employee' },
                        { name: 'Update an employee role' },
                        { name: 'Update an employee manager' },
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
                        this.viewAllEmployees();
                        break;
                    case 'Update an employee role':
                        this.updateEmployeeRole();
                        break;
                    case 'Update an employee manager':
                        this.updateEmployeeManager();
                        break;
                    case 'View employees by manager':
                        this.viewEmployeesByManager();
                        break;
                    case 'View employees by department':
                        this.viewEmployeesByDepartment();
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
    viewAllEmployees() {
        const employee = new Employee(this.db);
        employee.getAllEmployees()
            .then(() => this.run());
    }
    viewEmployeesByManager() {
        const employee = new Employee(this.db);
        const db = this.db;
        employee.getManagers().then(function (rows) {
            let managers = rows;
            return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'managerId',
                        message: `Please select a manager`,
                        choices: managers,
                    },
                ])
                .then(({ managerId }) => {
                    return employee.getAllEmployeesByManager(managerId);
                });
        })
            .then(() => this.run())
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
    }
    viewEmployeesByDepartment() {
        const department = new Department(this.db);
        const employee = new Employee(this.db);
        const db = this.db;
        department.getDepartments().then(function (rows) {
            let departments = rows;
            return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'departmentId',
                        message: `Please select a department`,
                        choices: departments,
                    },
                ])
                .then(({ departmentId }) => {
                    return employee.getAllEmployeesByDepartment(departmentId);
                });
        })
            .then(() => this.run())
            .catch((err) => {
                console.log('Oops. Something went wrong.');
            });
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
    updateEmployeeManager() {
        const employee = new Employee(this.db);
        const db = this.db;
        employee.getManagers().then(function (rows) {
            let managers = rows;

            return employee.getEmployeeNames().then(function (rows) {
                let employees = rows;
                return inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employeeId',
                            message: `Which  employees' s manager do you want to update ?`,
                            choices: employees,
                        },

                        {
                            type: 'list',
                            name: 'managerId',
                            message: `Who is the employees's new manager ?`,
                            choices: managers,
                        },
                    ])
                    .then(({ employeeId, managerId }) => {
                        const employee = new Employee(db);
                        const employeeDetails = {

                            managerId: managerId,
                            employeeId: employeeId,
                        };

                        return employee.updateManager(employeeDetails);
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
