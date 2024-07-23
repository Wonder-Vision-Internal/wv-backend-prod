const founderModel = require('../Models/founder.schema')


class Founder{

async getFounderList(req,res){
    console.log('hi');
    let founderlist = await founderModel.find()
    console.log('isFounderExist',founderlist)
    if(founderlist){
        res.status(200).json({
            list:founderlist
        })
    }
    else{
        res.status(500).json({
            message:'Unable To Fetch Founder List',
            status:0
        })
    }
}

async addMember(req,res){
    function founder_img() {
            let new_img = 'img/' + req.body.img
            return new_img
    }
    const founderObj={
        ...req.body,
        img:founder_img()
    }
    founderModel(founderObj).save()
    .then((data)=>{
        if(data._id){
            res.status(200).json({
                message:'Member Created Successfully',
                status:1
            })
        }
        else{
            res.status(500).json({
                message:'Failed To Create Member',
                status:0
            })
        }
    })
}

async getFounderById(req,res){
    
    let isFounderExist = await founderModel.findOne({_id:req.params.fid})
    console.log('hello',isFounderExist);
    if(isFounderExist){
        console.log(isFounderExist);
        res.status(200).json({
            founderDetails:isFounderExist
        })
    }
    else{
        res.status(500).json({
            message:'Unable To Fetch Founder Details'
        })
    }
}

async updateFounder(req,res){

    let isFounderExist = await founderModel.findOne({ _id: req.params.fid })
    function founder_img() {
        if (req.body.img !== 'undefined') {
            console.log('from if');
            let new_img = 'img/' + req.body.img
            return new_img
        }
        else if (req.body.img === 'undefined') {
            console.log('from else');
            let new_img = isFounderExist.img
            return new_img
        }
    }
    founderModel.findOneAndUpdate({_id:req.params.fid},
        {
            ...req.body,
            img:founder_img()
        }).then(()=>{
            res.status(200).json(
                {message:'Founder Details Updated Successfully',
                status:1
                })
        }).catch((err)=>{
            res.status(500).json({
                message:'Failed To Update Founder Details',
                Error:err
            })
        })
}

async deleteFounder(req,res){
    
    founderModel.findOneAndDelete({_id:req.params.fid})
    .then(()=>{
        res.status(200).json({
            message:'Member Deleted Successfully',
            status:1
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Delete Member',
            Error:err
        })        
    })
}

}
module.exports = new Founder