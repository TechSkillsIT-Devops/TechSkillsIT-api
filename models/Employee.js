const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    jobTitle: {
        type: String
    },
    managerId: {
        type: Number
    },
    email: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Employee = mongoose.model('employee',EmployeeSchema);