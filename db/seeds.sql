INSERT INTO departments (dep_name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

SELECT * FROM departments;

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Account Manager', 160000, 3),
       ('Accountant', 125000, 3), 
       ('Legal Team Lead', 250000, 4),
       ('Lawyer', 190000, 4);

SELECT * FROM roles;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Patrick', 'Bateman', 7, NULL),
       ('Max', 'Power', 8, 1),
       ('Bob', 'Ross', 5, NULL),
       ('Patrick', 'Star', 6, 3),
       ('Spongebob', 'Squarepants', 6, 3),
       ('John', 'Doe', 1, NULL),
       ('Jane', 'Doe', 2, 6),
       ('Amon', 'Gus', 3, NULL),
       ('Red', 'Sus', 4, 8);

SELECT * FROM employee;

