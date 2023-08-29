
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
