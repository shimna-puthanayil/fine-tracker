const { table } = require('./consoleTable');
class Role {

    constructor(db) {
        this.db = db;
    }

    // function to add role
    addRole = (role, callback) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
            const params = [role.title, role.salary, role.departmentId];
            this.db.promise().query(sql, params)
                .then(() => {

                    console.log(`Added ${role.title} to the database`);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to retrieve all roles
    getAllRoles = (callback) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT role.id as Id, title as Title, name AS Department, salary as Salary FROM  role JOIN department ON role.department_id=department.id ORDER BY Id ASC`;

            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    table(rows);
                    resolve();
                })
                .catch(() => reject());
        })
    }

    // function to retrieve all roles for the inquirer choice field in adding employees 
    getRoles() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id as value, title as name FROM  role`;
            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    resolve(rows);
                })
                .catch(() => reject());
        });
    }
}
module.exports = { Role };