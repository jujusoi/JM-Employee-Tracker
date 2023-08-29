const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '', //put password here
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
        return console.log('User chose ViewAllRoles');
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
        return console.log('User chose ViewAllDepartments');
    }
};

class AddDepartment {
    constructor() {
    } 
    furtherInquiry() {
        return console.log('User chose AddDepartment');
    }
};
module.exports = {
    ViewAllEmployees,
    AddEmployee,
    UpdateEmployeeRole,
    ViewAllDepartments,
    ViewAllRoles,
    AddRole,
    AddDepartment,
};