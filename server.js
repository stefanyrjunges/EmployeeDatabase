
//Importing file system to store, access and manage data
var fs = require('fs');
var data = fs.readFileSync('employees.json');
//Parsing the JSON file
var employeeData = JSON.parse(data);
//Importing express framework to build the server
var express = require('express');
var app = express();
//Listen for incoming connections
var server = app.listen(3000, listening);

//Checking if server is running
function listening() {
    console.log("Server listening...");
}

//Making the files in folder /website accessible
app.use(express.static('website'));

//Displaying all data in a page to test the server
app.get('/all', sendAll);
function sendAll(request, response){
    response.send(employeeData);
}

//Add employee functionality
//Creating an url to get user input
app.get('/add/:fname/:lname/:role/:dpt/:salary/:hireDate/:active', addEmployee)

function addEmployee(request, response) {
    //Getting data from user
    var data = request.params;
    var fName = data.fname;
    var lname = data.lname;
    var role = data.role;
    var dpt = data.dpt;
    var salary = data.salary;
    var hireDate = data.hireDate;
    var active = "Y"; //Set Y as a default value

    //Finding last employee in the array of employees
    const lastEmployee = employeeData.employees[employeeData.employees.length - 1];
    //Finding id associated with the last employee and adding 1 to it or starting with 1 if there's no one
    const nextEmpId = lastEmployee ? lastEmployee.empid + 1 : 1;

    //Creating a new employee with the data gathered from the user
    var newEmployee = {
        empid: nextEmpId,
        firstName: fName,
        lastName: lname,
        role: role,
        department: dpt,
        salary: salary,
        hireDate: hireDate,
        active: active
    };

        //If employeeData is not an array, create one
        if (!employeeData.employees || !Array.isArray(employeeData.employees)) {
            employeeData.employees = [];
        }

    //Appending the new employee to the database
    employeeData.employees.push(newEmployee);

        //Writing updated data to the file
        fs.writeFile('employees.json', JSON.stringify(employeeData, null, 4), (err) => {
            //If there's an error, display message
            if (err) {
                console.error('Error writing file:', err);
                response.status(500).send({msg: 'Error writing to file'});
                return;
            }

            console.log('Employee added successfully.');
            response.send({msg: 'Employee added successfully.'});
        });
}

//Remove employee
//Creating an url to get user input
app.get('/remove/:empid/:lname', removeEmployee)

function removeEmployee(request, response) {
    //Getting data from user
    const dataRemove = request.params;
    const empid = parseInt(dataRemove.empid);
    const lname = dataRemove.lname;

    //Finding employee in the array based on id
    const employee = employeeData.employees.find(emp => emp.empid === empid);

        //If the employee isnt found, display an error message
        if (!employee) {
            response.status(404).json({msg: 'Employee not found'});
            return;
        }

        //If the last name doesn't match the id, display an error message
        if (employee.lastName !== lname) {
            response.status(400).json({msg: 'Last name does not match for this employee ID'});
            return;
        }

    //Finding the index of the employee in the array
    const employeeIndex = employeeData.employees.findIndex(emp => emp.empid === empid);

    //Removing employee from array
    employeeData.employees.splice(employeeIndex, 1);

        //Writing updated data to the file
        fs.writeFile('employees.json', JSON.stringify(employeeData, null, 4), (err) => {
            //If there's an error, display message
            if (err) {
                console.error('Error writing file:', err);
                response.status(500).json({msg: 'Error writing to file'});
                return;
            }

            console.log('Employee removed successfully.');
            response.json({msg: 'Employee removed successfully.'});
        });
};


//Update employee
//Creating an url to get user input
app.get('/update/:empid/:field/:newValue', updateEmployee); 

function updateEmployee(request, response) {
    //Getting data from user
    const dataUpdate = request.params;
    const empid = parseInt(dataUpdate.empid);
    const field = dataUpdate.field;
    const newValue = dataUpdate.newValue;

    //Finding employee in the array based on id
    const employee = employeeData.employees.find(emp => emp.empid === empid);

        //If the employee isnt found, display an error message
        if (!employee) {
            console.error("Employee not found");
            response.status(400).json({msg: 'Employee not found'});
            return;
        }

    //Establishing valid fields to be accepted
    const validFields = ['lastName', 'active', 'role', 'department', 'salary'];
        //If the field is not in the array, display error message
        if (!validFields.includes(field)) {
            response.status(400).json({msg: `Invalid field: '${field}'. Allowed fields: ${validFields.join(', ')}`});
            return;
        }

    //Updating the field in the database
    employee[field] = field === 'salary' ? parseFloat(newValue) : newValue;

        //Writing data back to the file
        fs.writeFile('employees.json', JSON.stringify(employeeData, null, 4), (err) => {
            //If there's an error, display message
            if (err) {
                console.error('Error writing file:', err);
                response.status(500).json({ msg: 'Error writing to file' });
                return;
            }

            console.log(`Employee with ID ${empid} updated successfully.`);
            response.json({msg: 'Employee updated successfully.', updatedEmployee: employee});
        });
};

//Search employee
//Creating an url to get user input
app.get('/search/:empid/:fname/:lname', searchEmployee);

function searchEmployee(request, response){
    const dataSearch = request.params;
    //If the input was provided, store it, if not, set as null
    const empId = dataSearch.empid === 'null' ? null : parseInt(dataSearch.empid);
    const fname = dataSearch.fname === 'null' ? null : dataSearch.fname;
    const lname = dataSearch.lname === 'null' ? null : dataSearch.lname;

    //Find employee in the database using either employee id or first name and last name
    const findEmployee = employeeData.employees.find(
        emp => 
            (empId && emp.empid === empId) || 
            (fname && lname && emp.firstName === fname && emp.lastName === lname)
    );

    //If employee was not found, show error message
    if (!findEmployee) {
        console.error("Employee not found");
        response.status(400).json({msg: 'Employee not found'});
        return;
    } else {
        //If employee was found, display info
        console.log("Employee found:", findEmployee);
        response.json(findEmployee);
    }
}