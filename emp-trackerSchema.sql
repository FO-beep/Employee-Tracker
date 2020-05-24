DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
id INT  ,
name VARCHAR (30) NOT NULL,
 PRIMARY KEY (id)

);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT ,
title VARCHAR (30) NULL,
salary DECIMAL (10,4) NULL,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY(department_id) REFERENCES department (id)

);

CREATE TABLE employee (
    id INT  NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NULL,
manager_id INT NULL,
PRIMARY KEY (id) 
 FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE,
  FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE
  
);

