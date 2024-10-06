DO $$
BEGIN
  -- Begin transaction

  -- Insert departments
  INSERT INTO departments (name)
  VALUES 
    ('Sales'), 
    ('Engineering'), 
    ('Finance'), 
    ('Legal');

  -- Insert roles with department_id
  INSERT INTO roles (title, salary, department_id)
  VALUES
    ('Salesperson', 8000, (SELECT id FROM departments WHERE name = 'Sales')),
    ('Lead Engineer', 150000, (SELECT id FROM departments WHERE name = 'Engineering')),
    ('Software Engineer', 120000, (SELECT id FROM departments WHERE name = 'Engineering')),
    ('Account Manager', 160000, (SELECT id FROM departments WHERE name = 'Finance')),
    ('Accountant', 125000, (SELECT id FROM departments WHERE name = 'Finance')),
    ('Legal Team Lead', 250000, (SELECT id FROM departments WHERE name = 'Legal')),
    ('Manager', 260000, (SELECT id FROM departments WHERE name = 'Sales')),
    ('Lawyer', 190000, (SELECT id FROM departments WHERE name = 'Legal'));

  -- Insert employees with role_id and manager_id
  INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES
    ('John', 'Doe', (SELECT id FROM roles WHERE title = 'Salesperson'), NULL),
    ('Mike', 'Chan', (SELECT id FROM roles WHERE title = 'Lead Engineer'), (SELECT id FROM employees WHERE first_name = 'John' AND last_name = 'Doe')),
    ('Ashley', 'Rodriguez', (SELECT id FROM roles WHERE title = 'Software Engineer'), NULL),
    ('Kevin', 'Tupik', (SELECT id FROM roles WHERE title = 'Software Engineer'), (SELECT id FROM employees WHERE first_name = 'Ashley' AND last_name = 'Rodriguez')),
    ('Kunal', 'Singh', (SELECT id FROM roles WHERE title = 'Account Manager'), NULL),
    ('Malia', 'Brown', (SELECT id FROM roles WHERE title = 'Accountant'), (SELECT id FROM employees WHERE first_name = 'Kunal' AND last_name = 'Singh')),
    ('Sarah', 'Lourd', (SELECT id FROM roles WHERE title = 'Legal Team Lead'), NULL),
    ('Tom', 'Allen', (SELECT id FROM roles WHERE title = 'Lawyer'), (SELECT id FROM employees WHERE first_name = 'Sarah' AND last_name = 'Lourd'));

  -- If the code reaches here, it means no exceptions were raised.
  -- Thus, it will commit automatically at the end of the block.
  RAISE NOTICE 'Transaction complete';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'An error occurred: %', SQLERRM; -- Log the error
    ROLLBACK; -- Explicitly roll back changes in case of error
END $$;
