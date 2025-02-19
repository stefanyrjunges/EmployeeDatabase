function setup() {
    //Loading data from the server
    loadJSON('/all', gotData);
    console.log('running');
    
//Checking if data was loaded
function gotData(employeeData) {
    console.log('Data received:', employeeData);
}

    //Selecting element #updateOptions
    const selectElement = select('#updateOptions');
    //If the element #updateOptions exists, proceed
    if (selectElement) {
        selectElement.changed(function () {
            //Store value from "select" form attribute
            const selectedOption = selectElement.value();
            //Selecting elements that are currently hidden to display them later
            const extraInfoLBL = select('#extraInfoLBL');
            const extraInfoINP = select('#extraInfoINP');
            
            //Showing input fields based on the user's selection 
            switch (selectedOption) {
                case "lnameSLC":
                    extraInfoLBL.style("display", "inline");
                    extraInfoLBL.html("New last name:");
                    extraInfoINP.style("display", "inline");
                    break;
                case "activeSLC":
                    extraInfoLBL.style("display", "inline");
                    extraInfoLBL.html("New status (Y/N):");
                    extraInfoINP.style("display", "inline");
                    break;
                case "roleSLC":
                    extraInfoLBL.style("display", "inline");
                    extraInfoLBL.html("New role:");
                    extraInfoINP.style("display", "inline");
                    break;
                case "dptSLC":
                    extraInfoLBL.style("display", "inline");
                    extraInfoLBL.html("New department:");
                    extraInfoINP.style("display", "inline");
                    break;
                case "salarySLC":
                    extraInfoLBL.style("display", "inline");
                    extraInfoLBL.html("New salary:");
                    extraInfoINP.style("display", "inline");
                    break;
                default:
                    extraInfoLBL.style("display", "none");
                    extraInfoINP.style("display", "none");
            }
        });
    }

     //Button to display log in page
     const accessButton = select('#accessBTN');
        //If button exists, proceed
        if (accessButton) {
            accessButton.mousePressed(event => {
                //Preventing data submission twice
                event.preventDefault();
                //Call function to handle log in
                login();
            });
        //If button doesn't exist, display error message
        } else {
            console.error("Access button not found.");
        }

     //Button to access database
     const loginButton = select('#dashboardLogInBTN');
        //If button exists, proceed
        if (loginButton) {
            loginButton.mousePressed(event => {
                //Preventing data submission twice
                event.preventDefault();
                //Call function to handle access
                access();
            });
        //If button doesn't exist, display error message
        } else {
            console.error("Log in button not found.");
        }

    //Button for adding employee
    const addButton = select('#addEmployeeBTN');
        //If button exists, proceed
        if (addButton) {
            addButton.mousePressed(event => {
                //Preventing data submission twice
                event.preventDefault();
                //Call function to handle how employee's being added
                addEmployee();
            });
        //If button doesn't exist, display error message
        } else {
            console.error("Add Employee button not found.");
        }

    //Button for removing employee
    const removeButton = select('#removeEmployeeBTN');
        //If button exists, proceed
        if (removeButton) {
            removeButton.mousePressed(event => {
                //Preventing data submission twice
                event.preventDefault();
                //Call function to handle how employee's being removed
                removeEmployee();
            });
        //If button doesn't exist, display error message
        } else {
            console.error("Remove Employee button not found.");
        }

    //Button for updating employee's information
    const updateButton = select('#updateEmployeeBTN');
        //If button exists, proceed
        if (updateButton) {
            updateButton.mousePressed(event => {
                //Preventing data submission twice
                event.preventDefault();
                //Call function to handle how employee's information is being updated
                updateEmployeeInfo();
            });
        //If button doesn't exist, display error message
        } else {
            console.error("Update Employee button not found.");
        }

    //Button for searching employee
    const searchButton = select('#searchEmployeeBTN');
        //If button exists, proceed
        if (searchButton) {
            searchButton.mousePressed(event => {
                //Preventing data submission twice
                event.preventDefault();
                //Call function to handle how employee's being added
                searchEmployee();
            });
        //If button doesn't exist, display error message
        } else {
            console.error("Search Employee button not found.");
        }
    }

//Log in function
function login(){
    //Displaying form to log in
    const displayLogIn = select('#logIn-container');
    displayLogIn.style('display', 'inline');
}

//Access function
function access() {
    //Storing values from the form input fields
    const username = select('#usernameInput').value();
    const password = select('#passwordInput').value();
    const messageDiv = select('#message_login');

        //If username and password match, redirect to dashboard page
        if (username === "admin" && password === "admin1234") {
            location.href = "dashboard.html"; 
            console.log("Username and password correct.");
        } else {
            messageDiv.html("Username or password incorrect");
            messageDiv.style('display', 'inline');
            console.error("Username or password incorrect");
        }

    //Clearing input fields
    select('#usernameInput').value('');
    select('#passwordInput').value('');
}


const messageDiv = select('#message');

//Adding employee
function addEmployee() {
    //Storing values from the form input fields
    const fName = select('#fname').value();
    const lName = select('#lname').value();
    const role = select('#role').value();
    const dpt = select('#selectDepartment').value();
    const salary = select('#salary').value();
    const hireDate = select('#hireDate').value();
    //Selecting element that is currently hidden to display it later
    const messageDiv = select('#message');

        //Input field validation
        if (!fName || !lName || !role || !dpt || !salary || !hireDate) {
            messageDiv.html("Please fill in all the fields.");
            //Show hidden message
            messageDiv.style('display', 'block');
            console.error("Field missing.");
            return;
        } else {
            console.log('All fields validated.');
            //Sending user input to the server to add the employee
            loadJSON('add/' + fName + '/' + lName + '/' + role + '/' + dpt + '/' + salary + '/' + hireDate + '/Y', finishedAdd);
            //Clearing fields
            select('#fname').value('');
            select('#lname').value('');
            select('#role').value('');
            select('#selectDepartment').value('');
            select('#salary').value('');
            select('#hireDate').value('');
        }
}

//Function to display message to the user
function finishedAdd(employeeData) {
    const messageDiv = select('#message');

    //Show hidden message
    messageDiv.html("Employee added successfully.");
    messageDiv.style('display', 'block');
    console.log('Employee added:', employeeData);
}

//Remove employee
function removeEmployee() {
    //Storing values from the form input fields
    const empIDRemove = select('#empidRemove').value();
    const lname = select('#lnameUpdate').value();
    const checkbox = select('#resp');
    //Selecting element that is currently hidden to display it later
    const messageDiv = select('#message');
    
        //If employee ID and last name are provided, proceed
        if (empIDRemove && lname) {
            console.log('Fields validated.');
            //Check if the checkbox is checked
            if (checkbox.checked()) {
                console.log('Checkbox validated');
                //Sending user input to the server to add the employee
                loadJSON('/remove/' + empIDRemove + '/' + lname, finishedRemove, handleRemoveError);
                //Clearing fields
                select('#empidRemove').value('');
                select('#lnameUpdate').value('');
                select('#resp').checked(false);
            } else {
                messageDiv.html("Please check the box.");
                messageDiv.style('display', 'block');
                console.error('Checkbox is not checked');
            }
        //If employee ID and last name are not provided, display error message
        } else {
            messageDiv.html("Please fill in all the forms.");
            messageDiv.style('display', 'block');
            console.error("Field missing.");
        }
}

//Function to display message to the user
function finishedRemove(employeeData) {
    const messageDiv = select('#message');

    //Show hidden message
    messageDiv.html("Employee removed successfully.");
    messageDiv.style('display', 'block');
    console.log('Employee removed:', employeeData);
}

//If employee id and last name don't match, display error message
function handleRemoveError(error) {
    const messageDiv = select('#message');
    const errorMsg = error.msg || "ID and last name don't match. Please try again.";
    messageDiv.html(errorMsg);
    messageDiv.style('display', 'block');
    console.error("Error removing employee:", errorMsg);
}

//Update employee information
function updateEmployeeInfo() {
    //Storing values from the form input fields
    const empIDUpdate = select('#empidUpdate').value();
    const selectedOption = select('#updateOptions').value();
    //Selecting elements that are currently hidden to display them later
    const newInfo = select('#extraInfoINP').value();
    const messageDiv = select('#message');
    const extraInfoLBL = select('#extraInfoLBL');
    const extraInfoINP = select('#extraInfoINP');

        //If employee id and new information are not provided, display error message
        if (!empIDUpdate || !newInfo) {
            messageDiv.html("Please fill in all the forms.");
            messageDiv.style('display', 'block');
            console.error("Field missing.");
            return;
        } else {
            let updateField = '';

        //Setting which attribute in the database will be updated based on user selection
        switch (selectedOption) {
            case "lnameSLC":
                updateField = 'lastName';
                break;
            case "activeSLC":
                updateField = 'active';
                break;
            case "roleSLC":
                updateField = 'role';
                break;
            case "dptSLC":
                updateField = 'department';
                break;
            case "salarySLC":
                updateField = 'salary';
                break;
            default:
                messageDiv.html("Invalid option selected.");
                messageDiv.style('display', 'block');
                console.error("Invalid option selected.");
                return;
        }

        //Sending user input to the server to add the employee
        loadJSON('/update/' + empIDUpdate + '/' + updateField + '/' + newInfo, finishedUpdate, handleUpdateError);
        //Clearing fields
        select('#empidUpdate').value(''); 
        select('#updateOptions').value(''); 
        select('#extraInfoINP').value('');
        extraInfoLBL.style("display", "none");
        extraInfoINP.style("display", "none");
    }
}

//Function to display message to the user
function finishedUpdate(employeeData) {
    const messageDiv = select('#message');

    //Show hidden message
    messageDiv.html("Employee updated successfully.");
    messageDiv.style('display', 'block');
    console.log('Employee updated:', employeeData);
}

function handleUpdateError(error) {
    const message = select('#message');
    const errorMsg = error.msg || "Employee not found.";
    message.html(errorMsg);
    message.style('display', 'block');
    console.error("Error finding employee:", errorMsg);
}

//Search employee
function searchEmployee() {
    const empIDSearch = select('#empidSearch').value();
    const fname = select('#fnameSearch').value();
    const lname = select('#lnameSearch').value();
    const messageDiv = select('#message');

    //Input validation
    if (!empIDSearch && (!fname || !lname)) {
        messageDiv.html("Please provide either Employee ID or both first and last names.");
        messageDiv.style('display', 'block');
        console.error("Field missing.");
        return;
    }

    //Sending user input to the server to add the employee; if there's no input, set as null
    loadJSON(`/search/${empIDSearch || 'null'}/${fname || 'null'}/${lname || 'null'}`, finishedSearch, handleSearchError);

    //Clearing fields
    select('#empidSearch').value(''); 
    select('#fnameSearch').value(''); 
    select('#lnameSearch').value('');
}

//Function to display message to the user
function finishedSearch(employeeData) {
    const foundEmployeeMessage = select('#foundEmployeeMessage');

    //Storing employee information
    const empDetails = `<h2>Employee with ID ${employeeData.empid}</h2>
        First Name: ${employeeData.firstName}
        <br>Last Name: ${employeeData.lastName}
        <br>Role: ${employeeData.role}
        <br>Department: ${employeeData.department}
        <br>Salary: ${employeeData.salary} euros
        <br>Active: ${employeeData.active}
    `;

    //Show hidden message
    foundEmployeeMessage.html(empDetails);
    foundEmployeeMessage.style('display', 'block');
    console.log("Employee found:", employeeData);
}

function handleSearchError(error) {
    const foundEmployeeMessage = select('#foundEmployeeMessage');
    const errorMsg = error.msg || "Employee not found.";
    foundEmployeeMessage.html(errorMsg);
    foundEmployeeMessage.style('display', 'block');
    console.error("Error finding employee:", errorMsg);
}
