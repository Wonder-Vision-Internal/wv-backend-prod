const userModel=require('../Models/user.schema')

class User{

    async getAllUsers(req,res){
        try {
            let startIndex = (req.query.pageNumber - 1) * req.query.itemsPerPage;
            let endIndex = req.query.pageNumber * req.query.itemsPerPage;
            userModel.find({user_type:'user'})
            .then((data)=>{
                res.status(200).json({
                    allUsers: data.slice(startIndex, endIndex),
                    totalPages: Math.ceil(data.length / req.query.itemsPerPage)})
            }).catch((err)=>{
                res.status(500).json({message:'Failed To load Users',
                                    Error:err})
            })
        }catch (error) {
            res.status(500).send({ message: error.message });
        }

    }
}

module.exports=new User