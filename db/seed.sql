-- Insert data in to table department --

INSERT INTO department (name) VALUES("Engineering");
INSERT INTO department (name) VALUES("Finance");
INSERT INTO department (name) VALUES("Legal");
INSERT INTO department (name) VALUES("Sales");

-- Insert data in to table role --

INSERT INTO role (title,salary,department_id) VALUES("Sales Lead",100000,4);
INSERT INTO role (title,salary,department_id) VALUES("Sales Person",80000,4);
INSERT INTO role (title,salary,department_id) VALUES("Lead Engineer",150000,1);
INSERT INTO role (title,salary,department_id) VALUES("Software Engineer",120000,1);
INSERT INTO role (title,salary,department_id) VALUES("A/C Manager",160000,2);
INSERT INTO role (title,salary,department_id) VALUES("Accountant",125000,2);
INSERT INTO role (title,salary,department_id) VALUES("Legal Team Lead",250000,3);
INSERT INTO role (title,salary,department_id) VALUES("Lawyer",190000,3);

-- Insert data in to table employee --

INSERT INTO employee(first_name,last_name,role_id) VALUES('John','Doe',1);
INSERT INTO employee(first_name,last_name,role_id) VALUES('James','Philip',2);
INSERT INTO employee(first_name,last_name,role_id) VALUES('Natasha','Francis',3);
INSERT INTO employee(first_name,last_name,role_id) VALUES('Neda','George',4);
INSERT INTO employee(first_name,last_name,role_id) VALUES('John','Mathew',5);
INSERT INTO employee(first_name,last_name,role_id) VALUES('Julie','Khu',6);
INSERT INTO employee(first_name,last_name,role_id) VALUES('Rachel','Talbot',7);
INSERT INTO employee(first_name,last_name,role_id) VALUES('Kiran','Tk',8);