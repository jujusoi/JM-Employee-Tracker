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
        const result = this.viewQuery().then((result) => {
            console.table(result);
            repeatMainQ();
        });
    }
    viewQuery() {
        return new Promise((resolve, reject) => {
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
            if (err) {
                reject(err)
            } else {
                resolve(results);
            }
          })
        })
    }
};

class AddEmployee extends ParentClass {
    furtherInquiry() {
        db.query(`SELECT title, id FROM roles`, (err, result) => {
            if (err) {
                console.error(`Could not select roles, ${err}`);
            } else {
                const mappedRes = result.map((role) => role.title);
                db.query(`SELECT first_name, last_name, id FROM employee`, (err1, result1) => {
                    if (err) {
                        console.error(`Could not select names, ${err1}`);
                    } else {
                        const mapped2 = result1.map((role1) => `${role1.first_name} ${role1.last_name}`);
                        mapped2.push(`NULL`);
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'employeeName',
                            message: 'Enter first name of new employee:',
                        },
                        {
                            type: 'input',
                            name: 'employeeLastName',
                            message: 'Enter last name:',
                        },
                        {
                            type: 'list',
                            name: 'roleId',
                            message: `What is this employee's role?`,
                            choices: mappedRes,
                        },
                        {
                            type: 'list',
                            name: 'managerName',
                            message: `What is the name of this employee's manager?`,
                            choices: mapped2,
                        }
                    ]).then(({employeeName, employeeLastName, roleId, managerName}) => {
                        if (managerName !== 'NULL') {
                            const splitManager = managerName.split(" ");
                            const managerFirstName = splitManager[0];
                            const managerLastName = splitManager[1];
                            result.forEach(role => {
                                if (role.title === roleId) {
                                    const roleINT = role.id;
                                    result1.forEach(employee => {
                                        if (employee.first_name === managerFirstName && employee.last_name === managerLastName) {
                                            const managerINT = employee.id;
                                            db.query(`
                                            INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                            VALUES ('${employeeName}', '${employeeLastName}', ${roleINT}, ${managerINT});
                                            `, (err, result) => {
                                                if (err) {
                                                    console.error(`Failed to insert employee into table, ${err}`);
                                                } else {
                                                    console.log(`Successfully added employee!`);
                                                    repeatMainQ();
                                                 }
                                            })
                                        }
                                    });
                                }
                            });
                        } else {
                            result.forEach(role => {
                                if (role.title === roleId) {
                                    const roleINT = role.id;
                                    db.query(`
                                    INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES ('${employeeName}', '${employeeLastName}', ${roleINT}, ${managerName});
                                    `, (err, result) => {
                                        if (err) {
                                            console.error(`Failed to insert employee into table, ${err}`);
                                        } else {
                                            console.log(`Successfully added employee!`);
                                            repeatMainQ();
                                        }
                                    })
                                }
                            });
                        }
                    })
                    }
                })
            }
        })
    }
};

class UpdateEmployeeRole extends ParentClass {
    furtherInquiry() {
        db.query(`
        SELECT first_name, last_name, id FROM employee
        `, (err, result) => {
            if (err) {
                console.error(`Could not retrieve information from database, ${err}`);
            } else {
                const mapped = result.map((employee) => `${employee.first_name} ${employee.last_name}`);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: 'Which employee do you want to change?',
                        choices: mapped,
                    }
                ]).then(({employeeName}) => {
                    console.log(`Selected ${employeeName}`);
                    const splitEmployee = employeeName.split(" ");
                    const empFirst = splitEmployee[0];
                    const empSecond = splitEmployee[1];
                    result.forEach(employee => {
                        if (employee.first_name === empFirst && employee.last_name === empSecond) {
                            const employeeId = employee.id;
                            db.query(`
                            SELECT title, id FROM roles
                            `, (err2, result2) => {
                                if (err2) {
                                    console.error(`Could not select from database, ${err2}`);
                                } else {
                                    const mapped2 = result2.map((role) => role.title);
                                    inquirer.prompt([
                                        {
                                            type: 'list',
                                            name: 'employeeRole',
                                            message: 'Which new role do you want them to have?',
                                            choices: mapped2,
                                        }
                                    ]).then(({employeeRole}) => {
                                        result2.forEach(role => {
                                            if (role.title === employeeRole) {
                                                const roleINT = role.id;
                                                db.query(`
                                                UPDATE employee
                                                SET role_id = ${roleINT}
                                                WHERE id = ${employeeId}
                                                `, (err3, result3) => {
                                                    if (err3) {
                                                        console.error(`Failed to update employee role, ${err3}`);
                                                    } else {
                                                        console.log(`Successfully updated employee role!`);
                                                        repeatMainQ();
                                                    }
                                                })
                                            }
                                        });
                                    })
                                }
                            })
                        }
                    });
                })
            }
        })
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

class TotalBudgetByDepartment {
    furtherInquiry() {
        db.query(`
        SELECT id, dep_name FROM departments
        `, (err, result) => {
            if (err) {
                console.error(`Could not select from database, ${err}`);
            } else {
                const mapped = result.map((department) => department.dep_name);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'selectDepartment',
                        message: 'Department to choose by:',
                        choices: mapped,
                    }
                ]).then(({selectDepartment}) => {
                    const selectedDepartment = result.find(dep => dep.dep_name === selectDepartment);
                    db.query(`
                    SELECT id, salary FROM roles WHERE department_id = ${selectedDepartment.id};
                    `, (err2, res2) => {
                        if (err2) {
                            console.error(`Could not select from database, ${err2}`);
                        } else {
                            let cost = 0;
                            const roleIds = res2.map((obj) => obj.id);
                            let completed = roleIds.length;
                            roleIds.forEach(id => {
                                db.query(`
                                SELECT role_id FROM employee WHERE role_id = ${id};
                                `, (err3, res3) => {
                                    if (err3) {
                                        console.error(`Could not select from database, ${err3}`);
                                    } else {
                                        const employeeCount = res3.length;
                                        cost += res2.find(obj => obj.id === id).salary * employeeCount;
                                        completed--;
                                        if (completed <= 0) {
                                            console.log(`The total budget for this department is $${cost}`);
                                            repeatMainQ();
                                        }
                                    }
                                });
                            });
                        }
                    });
                })
            }
        })
    }
}

class ViewEmployeesByDepartment {
    furtherInquiry() {
        db.query(`
        SELECT * FROM departments
        `, (err1, res1) => {
            const mapped = res1.map((dep) => dep.dep_name);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedDepartment',
                    message: 'Department to choose by:',
                    choices: mapped,
                }
            ]).then(({selectedDepartment}) => {
                const view = new ViewAllEmployees();
                view.viewQuery().then((query) => {
                    const arr = [];
                    query.forEach(obj => {
                        if (obj.department === selectedDepartment) {
                            const newObj = {
                                first_name: '',
                                last_name: '',
                                department: ''
                            };
                            newObj.first_name = obj.first_name;
                            newObj.last_name = obj.last_name;
                            newObj.department = selectedDepartment;
                            arr.push(newObj);
                        }
                    });
                    console.table(arr);
                    console.log(`All employees for department listed!`);
                    repeatMainQ();
                });
            })
        })
    }
}

class ViewEmployeesByManager {
    furtherInquiry() {
        db.query(`
        SELECT * FROM employee WHERE manager_id IS NULL;
        `, (err1, res1) => {
            const mapped = res1.map((dep) => `${dep.first_name} ${dep.last_name}`);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedManager',
                    message: ' to choose by:',
                    choices: mapped,
                }
            ]).then(({selectedManager}) => {
                const view = new ViewAllEmployees();
                view.viewQuery().then((query) => {
                    let str = '';
                    const arr = [];
                    query.forEach(obj => {
                        if (obj.manager === selectedManager) {
                            const newObj = {
                                first_name: '',
                                last_name: '',
                                manager: ''
                            };
                            newObj.first_name = obj.first_name;
                            newObj.last_name = obj.last_name;
                            newObj.manager = selectedManager;
                            arr.push(newObj); 
                            str = `${obj.first_name}`;
                        }
                    });
                    if (str === '') {
                        console.log(`No employees under selected manager!`);
                        repeatMainQ();
                    } else {
                        console.table(arr);
                        console.log(`All employees managed by ${selectedManager} listed!`);
                        repeatMainQ();
                    }
                });
            })
        })
    }
}

            
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
    TotalBudgetByDepartment,
    ViewEmployeesByDepartment,
    ViewEmployeesByManager,
};
