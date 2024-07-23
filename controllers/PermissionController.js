const mongoose = require('mongoose')
const sidebarModel = require('../Models/sidebar.schema')
const userModel = require('../Models/user.schema')

const getallpermissions = async (req, res) => {

    sidebarModel.find()
        .then((data) => {

            res.status(200).json({ PermissionData: data })
        }).catch((err) => {
            res.status(500).json({ message: 'Failed To Load Permissions', Error: err })
        })

}


const updatePermissions = async (req, res) => {
    
        let permissions = await JSON.parse(req.body.permissions)
    
        userModel.findOneAndUpdate({ emp_id: req.body.emp_id }, {
            modules: permissions
        }).then(() => {
            res.status(200).json({ message: 'Permissions Updated Successfully', status: 1 })
        }).catch((err) => {
            res.status(500).json({ message: 'Failed To Update Permissions',Error:err})

        })
        
}





module.exports = { getallpermissions, updatePermissions }