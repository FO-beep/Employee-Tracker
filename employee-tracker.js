const mysql = require("mysql");
const inquirer = require("inquirer");

require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,

    //Your port; 
    port: 3306,

    //your username
    user: process.env.DB_USERNAME,

    //your password
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_db

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    promptOne();

});

function promptOne() {
    inquirer.prompt({
            type: "list",
            name: "toDo",
            message: "Would you like to do?",
            choices: [
                "View Employees",
                "View Employees by Department",
                "Add Employee",
                "Remove Employees",
                "Update Employee Role",
                "Add Role",
                "View Department Budget",

                "Exit"
            ]
        })
        .then(function ({
            toDo
        }) {
            switch (toDo) {
                case "View Employees":
                    viewEmployee();
                    break;
                case "View Employees by Department":
                    viewEmployeeByDepartment();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employees":
                    removeEmployees();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View Department Budget":
                    viewBudget();
                    break;


                case "Exit":
                    connection.end();
                    break;
            }

        });
}

// 

function viewEmployee() {
    console.log("Viewing employees\n");

    var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
LEFT JOIN role r
 ON e.role_id = r.id
LEFT JOIN department d
ON d.id = r.department_id
LEFT JOIN employee m
 ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        promptOne();
    });
    console.log(query.sql);
}

//========================================= 2."View Employees by Department" / READ by, SELECT * FROM

// Make a department array

function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");

    var query =
        `SELECT d.id, d.name, r.salary AS budget
FROM employee e
LEFT JOIN role r
 ON e.role_id = r.id
LEFT JOIN department d
ON d.id = r.department_id
GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(data => ({
            value: data.id,
            name: data.name
        }));

        console.table(res);
        console.log("Department view succeed!\n");

        promptDepartment(departmentChoices);
    });
    console.log(query.sql);
}


function promptDepartment(departmentChoices) {

    inquirer
        .prompt([{
            type: "list",
            name: "departmentId",
            message: "Which department would you choose?",
            choices: departmentChoices
        }])
        .then(function (answer) {
            console.log("answer ", answer.departmentId);

            var query =
                `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
FROM employee e
JOIN role r
 ON e.role_id = r.id
JOIN department d
ON d.id = r.department_id
WHERE d.id = ?`

            connection.query(query, answer.departmentId, function (err, res) {
                if (err) throw err;

                console.table("response ", res);
                console.log(res.affectedRows + "Employees are viewed!\n");

                promptOne();
            });
        });
}



// add new employee
function addEmployee() {
    console.log("Inserting an employee!")

    var query =
        `SELECT r.id, r.title, r.salary 
   FROM role r`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const roleChoices = res.map(({
            id,
            title,
            salary
        }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        console.log("RoleToInsert!");

        promptInsert(roleChoices);
    });
}

function promptInsert(roleChoices) {

    inquirer
        .prompt([{
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices
            },

        ])
        .then(function (answer) {
            console.log(answer);

            var query = `INSERT INTO employee SET ?`
            connection.query(query, {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.roleId,
                    manager_id: answer.managerId,
                },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.insertedRows + "Inserted successfully!\n");

                    promptOne();
                });
            // console.log(query.sql);
        });
}







// Remove, Delete Employees


function removeEmployees() {
    console.log("Deleting an employee");

    var query =
        `SELECT e.id, e.first_name, e.last_name
   FROM employee e`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deleteEmployeeChoices = res.map(({
            id,
            first_name,
            last_name
        }) => ({
            value: id,
            name: `${id} ${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("ArrayToDelete!\n");

        promptDelete(deleteEmployeeChoices);
    });
}




function promptDelete(deleteEmployeeChoices) {

    inquirer
        .prompt([{
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: deleteEmployeeChoices
        }])
        .then(function (answer) {

            var query = `DELETE FROM employee WHERE ?`;
            // when finished prompting, insert a new item into the db with that info
            connection.query(query, {
                id: answer.employeeId
            }, function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log(res.affectedRows + "Deleted!\n");

                promptOne();
            });
            // console.log(query.sql);
        });
}

// ----------- "Update Employee Role" ------- //

function updateEmployeeRole() {
    employeeArray();

}

function employeeArray() {
    console.log("Updating an employee");

    var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
JOIN role r
 ON e.role_id = r.id
JOIN department d
ON d.id = r.department_id
JOIN employee m
 ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const employeeChoices = res.map(({
            id,
            first_name,
            last_name
        }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("employeeArray To Update!\n")

        roleArray(employeeChoices);
    });
}

function roleArray(employeeChoices) {
    console.log("Updating a role");

    var query =
        `SELECT r.id, r.title, r.salary 
FROM role r`
    let roleChoices;

    connection.query(query, function (err, res) {
        if (err) throw err;

        roleChoices = res.map(({
            id,
            title,
            salary
        }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        console.log("roleArray to Update!\n")

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer
        .prompt([{
                type: "list",
                name: "employeeId",
                message: "Which employee do you want to set with the role?",
                choices: employeeChoices
            },
            {
                type: "list",
                name: "roleId",
                message: "Which role do you want to update?",
                choices: roleChoices
            },
        ])
        .then(function (answer) {

            var query = `UPDATE employee SET role_id = ? WHERE id = ?`
            // when finished prompting, insert a new item into the db with that info
            connection.query(query,
                [answer.roleId,
                    answer.employeeId
                ],
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.affectedRows + "Updated successfully!");

                    promptOne();
                });
            // console.log(query.sql);
        });
}



// "Add Role" / CREATE: INSERT INTO ---- //

function addRole() {

    var query = `SELECT * FROM department`
    // `SELECT d.id, d.name, r.salary AS budget
    //  FROM employee e
    //  JOIN role r
    //  ON e.role_id = r.id
    //  JOIN department d
    //  ON d.id = r.department_id
    //  GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({
            id,
            name
        }) => ({
            value: id,
            name: `${id} ${name}`
        }));

        console.table(res);
        console.log("Department array!");

        promptAddRole(departmentChoices);
    });
}

function promptAddRole(departmentChoices) {

    inquirer
        .prompt([{
                type: "input",
                name: "roleTitle",
                message: "Role title?"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Role Salary"
            },
            {
                type: "list",
                name: "departmentId",
                message: "Department?",
                choices: departmentChoices
            },
        ])
        .then(function (answer) {

            var query = `INSERT INTO role SET ?`

            connection.query(query, {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: answer.departmentId
                },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log("Role Inserted!");

                    // promptOne();
                    viewRoles();
                });

        });
}


viewRoles = () => {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + " roles found!");
        console.table("All Roles:", res);
        promptOne();
    });
};



// ------- View Department Budget ------ //

function viewBudget() {
    console.log("Total utilized department budget");

    var query = ` SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department, name ASC`

    connection.query(query, function (err, res) {
        if (err) throw err;



        const deptBudget = res.map(data => ({
            value: data.id,
            department: data.department_id,
            salary: data.salary
        }));

        console.table(res);
        console.log("Budget viewed!\n");


        promptOne();

    });

};