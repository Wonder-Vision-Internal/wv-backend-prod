const mongoose = require('mongoose')
const postModel = require('../Models/posts.schema')
const storyModel = require('../Models/stories.schema')


const filterStory = async (req, res) => {

    let isPostExist = await postModel.findOne({ slug: req.params.slug })
    
    postModel.aggregate([
        {
            $match:{
                slug:req.params.slug
            }
        },
        {
            $lookup:{
                from:'stories',
                localField:'_id',
                foreignField:'post_id',
                as:'storyData'
            }
        }
    ]).then((data) => {
            res.status(200).json({
                details: data
            })
        }).catch((err) => {
            res.status(400).json({
                Error: err
            })
        })
}

const getTestimonialStories = async(req,res)=>{
    storyModel.find({post_type:'company_testimonial'})
    .then((data)=>{
        res.status(200).json({
            storyData:data
        })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Load Testimonial Stories',
            Error:err
        })
    })
}


const addStory = async(req,res)=>{

    const storyObj={
        content:req.body.content,
        author:req.body.author,
        address:req.body.address,
        user_img:'img/' + req.body.img
    }

    if(req.body.slug){
        let isPostExist = await postModel.findOne({slug:req.body.slug})
        storyObj.post_id = new mongoose.Types.ObjectId(isPostExist._id)
    }
    else if(req.body.post_type){
        storyObj.post_type = req.body.post_type
    }
    console.log('storyobj',storyObj);
    
   
    storyModel(storyObj)
    .save()
    .then((data)=>{
        if(data._id){
            res.status(200).json({
                message:'Story Created Successfully',
                status:1
            })
        }else{
            res.status(500).json({
                message:'Failed To Create Story',
                status:0
            })
        }
        console.log('story created',data)
    }).catch((err)=>{
        res.status(500).json({
            Error:err
        })
        console.log('Err',err)
    })
}

const loadSingleStory = async(req,res)=>{
    console.log(req.params.storyid)
    storyModel.findOne({_id:req.params.storyid})
    .then((data)=>{
       res.status(200).json({
        storyDetails:data
       })
    }).catch((err)=>{
        res.status(500).json({
            message:'Failed To Load Story',
            Error:err
        })
    })
}

const updateStory = async(req,res)=>{
    let isStoryExist = await storyModel.findOne({_id:req.params.storyid})
    console.log('param',req.params);
    console.log('body',req.body);
    function story_img() {
        if (req.body.img !== "undefined") {
          console.log("from if");
          let new_img = "img/" + req.body.img;
          return new_img;
        } else if (req.body.img === "undefined") {
          console.log("from else");
          let new_img = isStoryExist.img;
          return new_img;
        }
      }
 
    storyModel.findOneAndUpdate({
        _id:req.params.storyid
    },{
        content:req.body.content,
        author:req.body.author,
        address:req.body.address,
        user_img:story_img()
    })
    .then(()=>{
        res.status(200).json({
            message:'Story Updated Successfully',
            status:1
        })
    })
    .catch((err)=>{
        res.status(500).json({
            message:'Failed to Update Story',
            Error:err
        })
    })
}

const deleteStory = async(req,res)=>{
    console.log('req.params.storyid',req.params.storyid)
    storyModel.findOneAndDelete({_id:new mongoose.Types.ObjectId(req.params.storyid)})
    .then(()=>{
        console.log('Deleted')
        res.status(200).json({
            message:'Story Deleted Successfully',
            status:1
        })
    })
    .catch((err)=>{
        console.log('Error in deleting the story',err)
        res.status(500).json({
            message:'Failed to delete the story'
        })
    })
}


const addPackageStory = async(req,res)=>{

    const storyObj={
        content:req.body.content,
        author:req.body.author,
        address:req.body.address,
        user_img:'img/' + req.body.img
    }

    if(req.body.slug){
        let isPostExist = await postModel.findOne({slug:req.body.slug})
        storyObj.post_id = new mongoose.Types.ObjectId(isPostExist._id)
    }
    else if(req.body.post_type){
        storyObj.post_type = req.body.post_type
    }
    console.log('storyobj',storyObj);
    
   
    storyModel(storyObj)
    .save()
    .then((data)=>{
        if(data._id){
            res.status(200).json({
                message:'Story Created Successfully',
                status:1
            })
        }else{
            res.status(500).json({
                message:'Failed To Create Story',
                status:0
            })
        }
        console.log('story created',data)
    }).catch((err)=>{
        res.status(500).json({
            Error:err
        })
        console.log('Err',err)
    })
}


module.exports = { filterStory, getTestimonialStories, addStory , deleteStory, loadSingleStory, updateStory,addPackageStory}