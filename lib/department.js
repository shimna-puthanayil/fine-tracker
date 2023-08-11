
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

    // function to retrieve all departments for the inquirer choice field in adding role 
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
}
module.exports = { Department };