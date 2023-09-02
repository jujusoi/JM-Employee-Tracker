const inquirer = require('inquirer');
const functions = require('./functions');

class CLI {
    constructor() {
    }
    inquire() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'firstQ',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Total Budget By Department', 'View Employees By Department', 'View Employees By Manager', 'Delete Department', 'Delete Role', 'Exit'],
            },
        ]).then(({firstQ}) => {
            const newResponse = firstQ.replace(/\s/g, "");
            functions.determineType(newResponse);
        });
    }
}

module.exports = CLI;