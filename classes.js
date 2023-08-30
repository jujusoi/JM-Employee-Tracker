const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '$$BBridge19', //put password here
    database: 'employee_tracker'
  },
  console.log(`Connected to the database.`)
);

class ViewAllEmployees {
    constructor() {
    } 
    furtherInquiry() {
        db.query(`
        SELECT employee.id as id,
       employee.first_name as first_name,
       employee.last_name as last_name, 
       roles.title as title, 
       departments.dep_name as department, 
       roles.salary as salary, 
       CONCAT(managing.first_name, ' ', managing.last_name) as manager
FROM employee
JOIN roles ON employee.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employee managing ON employee.manager_id = managing.id
ORDER BY employee.id ASC;
        `, (err, results) => {
          console.table(results);
          repeatMainQ();
        })
    }
};

class AddEmployee {
    constructor() {
    } 
    furtherInquiry() {
        return console.log('User chose AddEmployee');
    }
};

class UpdateEmployeeRole {
    constructor() {
    } 
    furtherInquiry() {
        return console.log('User chose UpdateEmployeeRole');
    }
};

class ViewAllRoles {
    constructor() {
    } 
    furtherInquiry() {
        db.query(`SELECT * FROM roles`, (err, result) => {
            console.table(result);
            repeatMainQ();
        });
    }
};

class AddRole {
    constructor() {
    } 
    furtherInquiry() {
        return console.log('User chose AddRole');
    }
};

class ViewAllDepartments {
    constructor() {
    } 
    furtherInquiry() {
        db.query(`SELECT * FROM departments`, (err, result) => {
            console.table(result);
            repeatMainQ();
        })
    }
};

class AddDepartment {
    constructor() {
    } 
    furtherInquiry() {
        return console.log('User chose AddDepartment');
    }
};

class Exit {
    constructor() {
    }
    furtherInquiry() {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'exitConfirm',
                message: 'Are you sure you want to exit?',
            }
        ]).then(({exitConfirm}) => {
            if (exitConfirm === true) {
                process.exit();
            } else {
                repeatMainQ();
            }
        })
    }
}

const repeatMainQ = () => {
    const CLI = require('./cli');
    const newCLI = new CLI();
    newCLI.inquire();
};

module.exports = {
    ViewAllEmployees,
    AddEmployee,
    UpdateEmployeeRole,
    ViewAllDepartments,
    ViewAllRoles,
    AddRole,
    AddDepartment,
    Exit,
};
