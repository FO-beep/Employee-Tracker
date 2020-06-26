
USE employee_trackerDB;

INSERT INTO department(name)
VALUES ("Production"), ("Marketing"), ("Research and Development"), ("Accounting and Finance"), ("Operations");


INSERT INTO role (title, salary, department_id)
VALUES ("Controls Engineer", 97000, 1), ("Marketing Manager", 95000, 2), 
("Researcher", 82000, 3), ("Financial Assistant", 79000, 4), ("Accountant", 65000, 4), 
("Operations Manager", 91000, 5), ("Supply Chain Coordinator", 60000, 5), 
("Inventory Controller", 45000, 5), ("Technical Writer", 55000, 3), ("Digital Marketing Specialist", 90000, 2) ;


INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES ("Mike", "Stratford", 1, 3), ("Annabel", "Lays", 2, 1), ("Lane", "Cooper", 3, null), ("Ryan", "Honey", 4, 7), ("Ruth", "Ville", 5, 2), ("Pearl", "Honors", 6, null), ("Dawn", "Shoes", 7, 4), ("Joy", "Hansen", 8, 3), ("Dan", "Song", 9, 1), ("Matt", "Bin", 10, null);
