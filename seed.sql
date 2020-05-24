USE employee_trackerDB;

--department table----->
INSERT INTO department (names,)
VALUES ("Production"), ("Marketing"), ("Research and Development"), ("Accounting and Finance"), ("Operations") ;

-----roles table ----->
INSERT INTO roles (title, salary, department_id)
VALUES ("Controls Engineer", 97000, 1), ("Marketing Manager", 95000, 2), ("Researcher", 82000, 3), ("Financial Assistant", 79000, 4), ("Accountant", 65000, 4), ("Operations Manager", 91000, 5), ("Supply Chain Coordinator", 60000, 5), ("Inventory Controller", 45000, 5), ("Technical Writer", 55000, 3), ("Digital Marketing Specialist", 90000, 2) ;

------- employee table ---->
INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES ("Mike", "Stratford", 1, 112), ("Annabel", "Lays", 2, 114), ("Lane", "Cooper", 3, 116), ("Ryan", "Honey", 4, 117), ("Ruth", "Ville", 5, 120), ("Pearl", "Honors", 6, 118), ("Dawn", "Shoes", 7, 122), ("Joy", "Hansen", 8, 124), ("Dan", "Song", 9, 121), ("Matt", "Bin", 11, 126), ("Triumph", "Bush", 12, 132);