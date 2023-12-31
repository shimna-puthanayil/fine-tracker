const { table } = require('./consoleTable');

//class for Role 
class Role {

    constructor(db) {
        this.db = db;
    }

    // function to add a role
    addRole = (role) => {
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

    // function to delete a role
    deleteRole = (roleId) => {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM role WHERE id=(?)`;
            const params = [roleId];
            this.db.promise().query(sql, params)
                .then(() => {
                    console.log(`Deleted the role`);
                    resolve();
                })
                .catch((err) => reject(err));
        })
    };

    // function to retrieve all roles
    getAllRoles = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT role.id as Id, title as Title, name AS Department, salary as Salary FROM  role JOIN department ON role.department_id=department.id ORDER BY Id ASC`;

            this.db.promise().query(sql)
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log(`No entries for roles. `);
                        return resolve();
                    }
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
                    if (rows.length === 0) {
                        console.log(`No entries for roles. `);
                    }
                    resolve(rows);
                })
                .catch(() => reject());
        });
    }
}
module.exports = { Role };