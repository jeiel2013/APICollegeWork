const express = require("express")
const app = express()
app.use(express.json())

const employees = []
const classes = []

function verifyEmployeeAlreadyExists(req, res, next) {
    const { employeeRegistration } = req.body
    const EmployeeAlreadyExists = employees.some((employee) => employee.employeeRegistration === employeeRegistration)
    if (EmployeeAlreadyExists) {
        return res.status(400).json({
            error: "Employee already exists!"
        })
    }
    return next()
}

function verifyClassAlreadyExists(req, res, next) {
    const { id } = req.body
    const ClassAlreadyExists = classes.some((classID) => classID.id === id)
    if (ClassAlreadyExists) {
        return res.status(400).json({
            error: "Class already exists!"
        })
    }
    return next()
}

function verifyIfEmployeeExists(req, res, next) {
    const { employeeRegistration } = req.body
    const employee = employees.find((employee) => employee.employeeRegistration === employeeRegistration)
    if(!employee) {
        return res.status(400).json({
            error: "Employee not found!"
        })
    }
    req.employee = employee
    return next()
}

function verifyIfClassExists(req, res, next) {
    const { id } = req.body
    const classId = classes.find((classId) => classId.id === id)
    if (!classId) {
        return res.status(400).json({
            error: "Class not found!"
        })
    }
    req.classId = classId
    return next()
}

function verifyClassAlreadyLinkedEmployee(req, res, next) {
    const { id } = req.body
    const { employee } = req
    if (employee.class.indexOf(id) === -1) {
        return next()
    } else {
        return res.status(400).json({
            error: "Class already linked!"
        })
    }
}

function nameFormated(name) {
    return name.toUpperCase()
}

function cpfFormated(cpf) {
    return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11)
}

function cellFormated(number) {
    return number.substring(0, 2) + " (" + number.substring(2, 4) + ") " + number.substring(4, 9) + "-" + number.substring(9, 13)
}

function dateFormated() {
    const newDate = new Date()
    const year = newDate.getFullYear()
    const month = newDate.getMonth() + 1
    const day = newDate.getDate()
    return `${day}/${month}/${year}`
}

function verifyLogin(req, res, next) {
    const { cpf, password } = req.headers
    const searchByCPF = employees.find((searchByCPF) => searchByCPF.cpf === cpfFormated(cpf))

    if (!searchByCPF) {
        return res.status(400).json({
            error: "Employee not found!"
        })
    }
    if(searchByCPF.cpf === cpfFormated(cpf) && searchByCPF.password === password) {
        return next()
    } else {
        return res.status(400).json({
            error: "Invalid login!"
        })
    }
}

function verifyClassLinkedEmployee(req, res, next) {
    const { classId } = req
    for (const valueEmployee of employees) {
        for (const valueClass of valueEmployee.class) {
            if (valueClass === classId.id) {
                return res.status(400).json({
                    error: "Class Linked at employee!"
                })
            }
        }
    }
    return next()
}

app.post("/register/employee", verifyEmployeeAlreadyExists, (req, res) => {
    const { name, employeeRegistration, password, cpf, email, birthDate, cellPhone } = req.body
    employees.push({
        name: nameFormated(name),
        employeeRegistration,
        cpf: cpfFormated(cpf),
        password,
        email,
        birthDate,
        cellPhone: cellFormated(cellPhone),
        createdAt: dateFormated(),
        class: []
    })
    return res.status(201).send()
}) // POST REGISTER EMPLOYEE

app.post("/register/class", verifyClassAlreadyExists, (req, res) => {
    const { name, id } = req.body
    classes.push({
        name, 
        id,
        createdAt: dateFormated()
    })
    return res.status(201).send()
}) // POST REGISTER CLASS

app.patch("/register/employee/class", verifyIfEmployeeExists, verifyIfClassExists, verifyClassAlreadyLinkedEmployee, (req, res) => {
    const { employee } = req
    const { id } = req.body
    employee.class.push(id)
    return res.status(201).send()
}) // PATCH REGISTER EMPLOYEE CLASS

app.get("/employees", (req, res) => res.status(200).send(employees)) // GET EMPLOYEES

app.get("/search/registration", verifyIfEmployeeExists, (req, res) => {
    const { employee } = req
    return res.status(200).send(employee)
}) // GET EMPLOYEES REGISTRATION

app.get("/search/cpf", (req, res) => {
    const { cpf } = req.body
    const searchByCPF = employees.find((searchByCPF) => searchByCPF.cpf === cpfFormated(cpf))
    
    if (!searchByCPF) {
        return res.status(400).json({
            error: "Employee not found!"
        })
    }
    return res.status(200).send(searchByCPF)
}) // GET EMPLOYEE CPF

app.get("/search/name", (req, res) => {
    const { name } = req.body
    const searchByName = employees.find((searchByName) => searchByName.name === nameFormated(name))

    if (!searchByName) {
        return res.status(400).json({
            error: "Employee not found!"
        })
    }
    return res.status(200).send(searchByName)
}) // GET EMPLOYEE NAME

app.get("/classes", (req, res) => res.status(200).send(classes)) // GET CLASSES

app.get("/search/classes/registration", verifyIfEmployeeExists, (req, res) => {
    const { employee } = req
    return res.status(200).send(employee.class)
}) // GET CLASSES REGISTRATION

app.get("/search/class", verifyIfClassExists, (req,res) => {
    const { classId } = req
    return res.status(200).send(classId)
}) // GET CLASS

app.put("/employee", verifyLogin, (req, res) => {
    const { name, password, email, birthDate, cellPhone } = req.body
    const { cpf } = req.headers
    const searchByCPF = employees.find((searchByCPF) => searchByCPF.cpf === cpfFormated(cpf))

    if (!searchByCPF) {
        return res.status(400).json({
            error: "Employee not found!"
        })
    }

    searchByCPF.name = nameFormated(name)
    searchByCPF.password = password
    searchByCPF.email = email
    searchByCPF.birthDate = birthDate
    searchByCPF.cellPhone = cellFormated(cellPhone)
    return res.status(200).send()
}) // PUT EMPLOYEE

app.delete("/employee", verifyIfEmployeeExists, (req, res) => {
    const { employee } = req
    const index = employees.indexOf(employee)
    employees.splice(index, 1)
    return res.status(200).json(employees)
}) // DELETE EMPLOYEE

app.delete("/class", verifyIfClassExists, verifyClassLinkedEmployee, (req, res) => {
    const { classId } = req
    const index = classes.indexOf(classId)
    classes.splice(index, 1)
    return res.status(200).json(classes)
}) // DELETE EMPLOYEE

app.listen(3333)