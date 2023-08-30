const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '', //put password here
    database: 'employee_tracker'
  },
  console.log(`Connected to the database.`)
);

class ParentClass {
    constructor(input) {
        this.input = input;
    }
}

class ViewAllEmployees extends ParentClass {
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

class AddEmployee extends ParentClass {
    furtherInquiry() {
        return console.log('User chose AddEmployee');
    }
};

class UpdateEmployeeRole extends ParentClass {
    furtherInquiry() {
        return console.log('User chose UpdateEmployeeRole');
    }
};

class ViewAllRoles extends ParentClass {
    furtherInquiry() {
        db.query(`SELECT * FROM roles`, (err, result) => {
            console.table(result);
            repeatMainQ();
        });
    }
};

class AddRole extends ParentClass {
    furtherInquiry() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role you want to create?',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the role you want to create?',
            },
            {
                type: 'input',
                name: 'roleDepartment',
                message: 'What is the department id linked to the role you want to create? View department table for further info',
            }
        ]).then(({roleName, roleSalary, roleDepartment}) => {
            db.query(`
            SELECT EXISTS (SELECT 1 FROM roles WHERE title = '${roleName}') AS varCheck
            `, (err, result) => {
                if (err) {
                    console.error(`Failed to run filter command, ${err}`);
                } else {
                    const check = result[0].varCheck;
                    if (check === 1) {
                        console.log(`Role already exists!`);
                        repeatMainQ();
                    } else {
                        db.query(`
                        INSERT INTO roles (title, salary, department_id)
                        VALUES ('${roleName}', ${roleSalary}, ${roleDepartment});
                        `, (err, result) => {
                            if (err) {
                                console.error(`Failed to insert inputs, ${err}`);
                            } else {
                                console.log(`Successfully added new role!`);
                                repeatMainQ();
                        }
                    }) 
                }}
            });
        })
    }
};

class ViewAllDepartments extends ParentClass {
    furtherInquiry() {
        db.query(`SELECT * FROM departments`, (err, result) => {
            console.table(result);
            repeatMainQ();
        })
    }
};

class AddDepartment extends ParentClass {
    furtherInquiry() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'departmentCreation',
                message: 'What is the department you want to create?',
            }
        ]).then(({departmentCreation}) => {
            db.query(`
            SELECT EXISTS (SELECT 1 FROM departments WHERE dep_name = '${departmentCreation}') AS varCheck
            `, (err, result) => {
                if (err) {
                    console.error(`Failed to run filter command, ${err}`);
                } else {
                    const check = result[0].varCheck;
                    if (check === 1) {
                        console.log(`Department already exists!`);
                        repeatMainQ();
                    } else {
                        db.query(`
                        INSERT INTO departments (dep_name)
                        VALUES ('${departmentCreation}');
                        `, (err, result) => {
                            if (err) {
                                console.error(`Error adding department, ${err}`);
                            } else {
                                console.log('Successfully added new department!');
                                repeatMainQ();
                      }})
                   }
                }
            });
        })
    }
};

class Exit {
    furtherInquiry() {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'exitConfirm',
                message: 'Are you sure you want to exit?',
            }
        ]).then(({exitConfirm}) => {
            if (exitConfirm === true) {
                console.log('Bye bye!');
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
