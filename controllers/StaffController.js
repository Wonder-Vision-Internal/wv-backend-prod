var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const userModel = require('../Models/user.schema')

class Staff {

    async getAllStaffs(req, res) {
        try {
            let startIndex = (req.query.pageNumber - 1) * req.query.itemsPerPage;
            let endIndex = req.query.pageNumber * req.query.itemsPerPage;
    
            userModel.find({ user_type: 'sub-admin' })
                .then((data) => {
                    res.status(200).json({
                        staffData: data.slice(startIndex, endIndex),
                        totalPages: Math.ceil(data.length / req.query.itemsPerPage),
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Load Staff Details',
                        Error: err
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async searchByEmpId(req, res) {
        try {
            userModel.find({
                emp_id: {
                    $regex: req.params.emp_id
                }
            }).then((data) => {
                res.status(200).json({
                    staffData: data
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'No such Employee Found',
                    Error: err
                })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async addStaff(req, res) {
        try {
            let isEmpIdExist = await userModel.findOne({ emp_id: req.body.emp_id })
         
            let isEmailExist = await userModel.findOne({ mail: req.body.mail })
            if (isEmpIdExist) {
                res.status(400).json({ message: 'Employee ID Already Exists' })
            }
            else if (isEmailExist) {
                res.status(400).json({ message: 'Email ID Already Exists' })
            }
            else {
                userModel({
                    ...req.body,
                    user_type: 'sub-admin',
                    password: bcrypt.hashSync(req.body.password, 10)
                }).save()
                    .then((data) => {
                        if (data._id) {
                            res.status(200).json({
                                message: 'Staff Member Created Successfully',
                                status: 1
                            })
                        }
                    }).catch((err) => {
                        res.status(500).json({
                            message: 'Failed To Create Staff Member',
                            Error: err
                        })
                    })
            }
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

    async updateStaff(req, res) {
        try {
            let isStaffExist = await userModel.findOne({ mail: req.body.mail })
            userModel.findOneAndUpdate({ _id: req.body.id },
                {
                    ...req.body,
                    password: req.body.password === '' ? isStaffExist.password
                        : bcrypt.hashSync(req.body.password, 10),
                    updated_at: Date.now()
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Staff Details Updated Successfully',
                        status: 1
                    })
                }).catch((err) => {
                    res.status(500).json({
                        message: 'Failed To Update Staff Details',
                        Error: err
                    })
                })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }
    async getPermissionsById(req, res) {
        try {
            userModel.findOne({ emp_id: req.params.emp_id })
            .then((data) => {
                res.status(200).json({ permissionData: data })
            }).catch((err) => {
                res.status(500).json({ message: 'Failed To load permissions', Error: err })
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }

}

module.exports = new Staff