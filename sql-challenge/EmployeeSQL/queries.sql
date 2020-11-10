-- List: employee number, last name, first name, sex, and salary of each employee.
SELECT employees.emp_no,employees.last_name,employees.first_name,employees.sex,salaries.salary FROM employees
FULL OUTER join salaries on employees.emp_no=salaries.emp_no;

--List first name, last name, and hire date for employees who were hired in 1986
SELECT first_name,last_name,hire_date FROM employees
WHERE 
	hire_date LIKE '%1986'

--List the manager of each department with department number, department name, the manager's employee number, last name, first name
SELECT employees.emp_no,employees.last_name,employees.first_name,
departments.dept_name
FROM employees
INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
INNER JOIN titles ON titles.title_id=employees.emp_title_id
WHERE
	titles.title='Manager'

--List the department of each employee with employee number, last name, first name, and department name
SELECT employees.emp_no,employees.last_name,employees.first_name,
departments.dept_name
FROM employees
INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no;

--List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B."
SELECT employees.first_name,employees.last_name,employees.sex
FROM employees
WHERE
	first_name='Hercules'
	AND last_name LIKE 'B%'
	
--List all employees in the Sales department, including their employee number, last name, first name, and department name
SELECT employees.emp_no,employees.last_name,employees.first_name,
departments.dept_name
FROM employees
INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
WHERE 
	departments.dept_name='Sales';
	
--List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name
SELECT employees.emp_no,employees.last_name,employees.first_name,
departments.dept_name
FROM employees
INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
WHERE 
	departments.dept_name='Sales'
	OR departments.dept_name='Development';

--In descending order, list the frequency count of employee last names, i.e., how many employees share each last name
SELECT last_name, COUNT(last_name) AS "count"
FROM employees
GROUP BY last_name
ORDER BY "count" DESC
