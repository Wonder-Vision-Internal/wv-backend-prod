const mongoose = require('mongoose')
const postModel = require('../Models/posts.schema')

class Tailormade{

async getTailormade(req,res){
    postModel.findOne({_id:new mongoose.Types.ObjectId('654a167ab8e9558407e0c5f8')})
    .then((data)=>{
        res.status(200).json({
            tailorData:data
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Fetch Tailormade Details',
            Error:err
        })
    })
}

async addTailormade(req,res){
    console.log(req.body);
    let obj
    if(req.body.type === 'picture'){
        obj={
            video_link:"",
            featured_img:'img/'+req.body.featured_img,
            status:1
        }
    }
    else if(req.body.type === 'video'){
        obj={
            featured_img:"",
            video_link:req.body.video_link,
            status:1
        }
    }
    postModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId('654a167ab8e9558407e0c5f8')},obj)
    .then(()=>{
        res.status(200).json({
            message:'Tailormade Item Created Successfully',
            status:1
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Create Tailormade Item',
            Error:err
        })
    })
}

async updateTailormade(req,res){
    console.log('body',req.body);
    let obj  
    if(req.body.type === 'video'){
        obj={
            video_link:req.body.video_link,
            status:1    
        }
    }
    else if(req.body.type === 'picture'){
        obj={
            featured_img:'img/' + req.body.featured_img,
            status:1
        }
    }
    postModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(req.body.postId)},obj)
    .then(()=>{
        res.status(200).json({
            message:'Tailormade Details Updated Successfully',
            status:1
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Update Tailormade Details',
            Error:err
        })
    })
}

}

module.exports = new Tailormade