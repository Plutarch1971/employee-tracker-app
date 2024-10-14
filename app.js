// app.js
const inquirer = require('inquirer');
const pool = require('./db/connection');
const businessRouter = require('./routes/business.router')

async function startApp() {
  const { option } = await inquirer.prompt({
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Exit',
    ],
  });

  switch (option) {
    case 'View All Departments':
      return viewDepartments();
    case 'View All Roles':
      return viewRoles();
    case 'View All Employees':
      return viewEmployees();
    case 'Add Department':
      return addDepartment();
    case 'Add Role':
      return addRole();
    case 'Add Employee':
      return addEmployee();
    case 'Update Employee Role':
      return updateEmployeeRole();
    default:
      process.exit();
  }
}

// View Departments
async function viewDepartments() {
  const result = await pool.query('SELECT * FROM departments');
  console.table(result.rows);
  startApp();
}

// View Roles
async function viewRoles() {
  const result = await pool.query('SELECT roles.*, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id');
  console.table(result.rows);
  startApp();
}

// View Employees
async function viewEmployees() {
  const result = await pool.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department,
   CONCAT(manager.first_name,' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
  `);
  console.table(result.rows);
  startApp();
}

// Add Department
async function addDepartment() {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the department name:',
  });
  await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  console.log(`Added ${name} to the database`);
  startApp();
}

// Add Role
async function addRole() {
  const departments = await pool.query('SELECT * FROM departments');
  const { title, salary, department_id } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter the role title:' },
    { type: 'input', name: 'salary', message: 'Enter the salary:' },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department:',
      choices: departments.rows.map((dept) => ({ name: dept.name, value: dept.id })),
    },
  ]);
  await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Added ${title} role to the database`);
  startApp();
}

// Add Employee
async function addEmployee() {
  const roles = await pool.query('SELECT * FROM roles');
  const employees = await pool.query('SELECT * FROM employees');
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { type: 'input', name: 'first_name', message: 'Enter the first name:' },
    { type: 'input', name: 'last_name', message: 'Enter the last name:' },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role:',
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager:',
      choices: [{ name: 'None', value: null }].concat(
        employees.rows.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        }))
      ),
    },
  ]);
  await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
  console.log(`Added ${first_name} ${last_name} to the database`);
  startApp();
}

// Update Employee Role
async function updateEmployeeRole() {
  const employees = await pool.query('SELECT * FROM employees');
  const roles = await pool.query('SELECT * FROM roles');
  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employees.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role:',
      choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
    },
  ]);
  await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log(`Updated employee's role`);
  startApp();
}

startApp();
