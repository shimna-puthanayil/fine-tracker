
const { table } = require('./consoleTable');
class Department {

    constructor(db) {
        this.db = db;
    }

    // function to add department
    addDepartment = (department, callback) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = department;
            this.db.promise().query(sql, params)
                .then(() => {

                    console.log(`Added ${department} to the database`);
                    resolve();
                })
                .catch(() => reject());
        })
    };

    // function to delete a department
    deleteDepartment = (departmentId, callback) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM department WHERE id=(?)`;
            const params = [departmentId];
            this.db.promise().query(sql, params)
                .then(() => {

                    console.log(`Deleted the department`);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to retrieve all departments
    getAllDepartments = (callback) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id as Id, name as Name FROM  department`;
            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    table(rows);
                    resolve();
                })
                .catch(() => reject());
        })
    }

    // function to retrieve all departments for the inquirer choice field 
    getDepartments() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id as value, name as name FROM  department`;
            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    resolve(rows);
                })
                .catch(() => reject());
        });
    }

    // function to retrieve the utilized budget of a department
    getUtilizedBudget(departmentId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT  department.name as Department , SUM(salary) as UtilizedBudget FROM employee JOIN role ON role.id=employee.role_id JOIN department ON role.department_id=department.id WHERE role.department_id=(?) GROUP BY role.department_id`;
            const params = departmentId;
            this.db.promise().query(sql, params)
                .then(([rows, fields]) => {
                    table(rows);
                    resolve(rows);
                })
                .catch(() => reject());
        });
    }
}
module.exports = { Department };