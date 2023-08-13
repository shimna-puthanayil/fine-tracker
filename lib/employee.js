const { table } = require('./consoleTable');

//class for Employee 
class Employee {

    constructor(db) {
        this.db = db;
    }

    // function to add an employee
    addEmployee = (employee) => {
        return new Promise((resolve, reject) => {
            let sql;
            if (employee.managerId === 'None') {
                sql = `INSERT INTO employee (first_name,last_name,role_id) VALUES (?,?,?)`;
            }
            else {
                sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`;
            }

            const params = [employee.firstName, employee.lastName, employee.roleId, employee.managerId];
            this.db.promise().query(sql, params)
                .then(() => {
                    console.log(`Added ${employee.firstName} ${employee.lastName} to the database`);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to delete an employee
    deleteEmployee = (employeeId) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM employee WHERE id=(?)`;
            const params = [employeeId];
            this.db.promise().query(sql, params)
                .then(() => {
                    console.log(`Deleted the employee. `);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to update an employee's role
    updateEmployeeRole = (employee) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE  employee SET role_id=(?) WHERE id=(?) `;
            const params = [employee.roleId, employee.employeeId];
            this.db.promise().query(sql, params)
                .then(() => {
                    console.log(`Updated employee's role. `);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to update an employee's manager
    updateManager = (employee) => {
        return new Promise((resolve, reject) => {
            let sql;
            let params;
            if (employee.managerId === 'None') {
                sql = `UPDATE  employee SET manager_id=null WHERE id=(?)`;
                params = [employee.employeeId];
            }
            else {
                sql = `UPDATE  employee SET manager_id=(?) WHERE id=(?) `;
                params = [employee.managerId, employee.employeeId];
            }


            this.db.promise().query(sql, params)
                .then(() => {
                    console.log(`Updated employee's manager. `);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to retrieve all employees
    getAllEmployees = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT employee.id AS Id, employee.first_name AS FirstName,employee.last_name AS LastName, role.title AS Role,department.name as Department,role.salary AS Salary,CONCAT(EMP.first_name,' ',EMP.last_name) AS Manager FROM  employee LEFT OUTER JOIN role  ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT OUTER JOIN employee as EMP ON employee.manager_id=EMP.id ORDER BY employee.id`;
            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log(`No entries for employees. `);
                        return resolve();;
                    }
                    table(rows);
                    resolve();
                })
                .catch(() => reject());
        })
    }

    // function to retrieve all employees by manager
    getAllEmployeesByManager = (managerId) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT employee.id AS Id, employee.first_name AS FirstName,employee.last_name AS LastName, role.title AS Role,department.name as Department,role.salary AS Salary,CONCAT(EMP.first_name,' ',EMP.last_name) AS Manager FROM  employee JOIN role  ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT OUTER JOIN employee as EMP ON employee.manager_id=EMP.id WHERE employee.manager_id=(?)`;
            const params = [managerId];
            this.db.promise().query(sql, params)
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log(`No employees under this manager. `);
                        return resolve();;
                    }
                    table(rows);
                    resolve();
                })
                .catch(() => reject());
        })
    }

    // function to retrieve all employees by department
    getAllEmployeesByDepartment = (departmentId) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT employee.id AS Id, employee.first_name AS FirstName,employee.last_name AS LastName, role.title AS Role,department.name as Department,role.salary AS Salary,CONCAT(EMP.first_name,' ',EMP.last_name) AS Manager FROM  employee JOIN role  ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT OUTER JOIN employee as EMP ON employee.manager_id=EMP.id WHERE role.department_id=(?)`;
            const params = [departmentId];
            this.db.promise().query(sql, params)
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log(`No employees under this department. `);
                        return resolve();
                    }
                    table(rows);
                    resolve();
                })
                .catch(() => reject());
        })
    }

    // function to retrieve all managers for the inquirer choice field in adding employees 
    getManagers() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT employee.id as value, CONCAT(first_name,' ',last_name) as name FROM  employee JOIN role on employee.role_id=role.id where role.title IN('Sales Lead','Lead Engineer','A/C Manager','Legal Team Lead')`;
            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log(`Currently there are no entries for managers.`);
                    }
                    resolve(rows);
                })
                .catch(() => reject());
        });
    }

    // function to retrieve all employees' name and id for the inquirer choice field in updating employee roles
    getEmployeeNames() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT employee.id as value, CONCAT(first_name,' ',last_name) as name FROM  employee`;
            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log(`Currently there are no entries for employees . `);
                    }
                    resolve(rows);
                })
                .catch(() => reject());
        });
    }
}

module.exports = { Employee };