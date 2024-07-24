var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const userModel = require('../Models/user.schema')
const { validationResult } = require('express-validator')
const sidebarModel = require('../Models/sidebar.schema')



const signUp = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            console.log('body', req.body);
            const userObj = {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 10),
                user_type: 'user',
                created_by: '1'
            }
            const isUserExist = await userModel.findOne({ mail: req.body.mail })
            if (isUserExist) {
                res.status(400).json({ message: 'Email Id already exists' })
            } else {
                userModel(userObj).save().then(() => {
                    console.log('then');
                    res.status(200).json({ message: 'User Registered Successfully' })
                }).catch((err) => {
                    console.log('catch');
                    res.status(500).json({ Error: err, message: 'Registration Failed' })
                })
            }
        } else {
            console.log('errors', errors.array());
            res.status(422).json({ errors: errors.array() })
        }
    
    }catch (error) {
        res.status(500).send({ message: error.message });
    }


}



const login = async (req, res) => {
    try {
        const isUserExist = await userModel.findOne({ mail: req.body.mail })

    
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            if (isUserExist) {
                const obj = { ...req.body, userType: isUserExist.user_type }
                const token = jwt.sign(obj, process.env.JWT_CODE,
                    {
                        expiresIn: '30m'
                    })
                if (bcrypt.compareSync(req.body.password, isUserExist.password)) {
    
                    res.status(200).json({
                        message: 'Login Successful',
                        token: token,
                        name: isUserExist.name,
                        mail: isUserExist.mail,
                        points:isUserExist.user_type==='admin' || isUserExist.points ==='' ? '' : isUserExist.points,
                        user_type: isUserExist.user_type === 'admin' ? 'admin' : isUserExist.emp_id,
                        status: isUserExist.user_type === 'admin' ? 1 :
                            isUserExist.user_type === 'sub-admin' ? 2 : isUserExist.user_type === 'user' ? 3 : null
                    })
                }
                else {
                    console.log('password does not match');
                    res.status(500).json({
                        message: 'Password Does Not Match',
                        status: 0
                    })
                }
            }
            else {
                res.status(500).json({
                    message: 'User Does Not Exist',
                    status: -1
                })
            }
        }
        else {
            res.status(422).json({ errors: errors.array() })
        }
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

}

const verifyToken = async (req, res) => {

    res.status(200).json({
        // message:'Token Verified Successfully',
        status: 1
    })
}


const getSidebarModules = async (req, res) => {
    try {
        let hashEmp = req.body.userType
        let allUsers = await userModel.find()
        let allModules = await sidebarModel.find()
        
        if (bcrypt.compareSync('admin', req.body.userType)) {
            res.status(200).json({ sidemodules: allModules })
        }
    
        else {       
            allUsers.map((data) => {
                let emp = data.emp_id
                if (data.emp_id && bcrypt.compareSync(emp, hashEmp)) {
                    
                    userModel.findOne({ emp_id: data.emp_id })
                        .then((x) => {
                            res.status(200).json({ sidemodules: x.modules })
                            return
                        }).catch((err) => {
                            res.status(500).json({ message: 'Unable To Find Modules', Error: err })
                            return
                        })
                }
            })
        }
    }catch (error) {
        res.status(500).send({ message: error.message });
    }

}

module.exports = { signUp, login, verifyToken, getSidebarModules }