const mongoose = require('mongoose')
const postModel = require('../Models/posts.schema')
const bannerModel = require('../Models/banner.schema')

class Awards {

async getAllAwards(req,res){
    console.log('hello');
    postModel.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId('654df638e8a09dae472e65e4')
            }
        },
        {
            $lookup:{
                from:'Banner',
                localField:'_id',
                foreignField:'post_id',
                as:'awards'
            }
        }
    ]).then((data)=>{
        console.log(data);
        res.status(200).json({
            awardData:data
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Unable To Fetch Awards & Certifications',
            Error:err
        })
    })
}

async addAward(req,res){
    console.log('hello');
    const awardObj={
        post_id:new mongoose.Types.ObjectId('654df638e8a09dae472e65e4'),
        img:'img/'+req.body.img
    }
    bannerModel(awardObj).save()
    .then((data)=>{
        if(data._id){
            res.status(200).json({
                message:'Award/Certificate Added Successfully',
                status:1
            })
        }
        else{
            res.status(500).json({
                message:'Failed To Add Award/Certificate'
            })
        }
    })
}

async deleteAward(req,res){
    bannerModel.findOneAndDelete({_id:req.params.awardId})
    .then(()=>{
        res.status(200).json({
            message:'Picture Deleted Successfully',
            status:1
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Delete Picture'
        })
    })
}

async updateAward(req,res){
    console.log('hello',req.body);
    if(req.body.postId){
        postModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(req.body.postId)},
        {
            small_text:req.body.small_text
        }).then(()=>{
            res.status(200).json({
                message:'Award Note Updated Successfully',
                status:1
            })
        }).catch((err)=>{
            res.status(500).json({
                message:'Failed To Update Award Note'
            })
        })
    }
    else if(req.body.awardId){
        bannerModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(req.body.awardId)},
        {
            img:'img/' + req.body.img
        }).then(()=>{
            res.status(200).json({
                message:'Award Picture Updated Successfully',
                status:1
            })
        }).catch((err)=>{
            res.status(500).json({
                message:'Failed To Update Award Picture'
            })
        })
    }
}

}

module.exports = new Awards